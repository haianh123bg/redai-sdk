import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';
import { HttpMethod, TsRouteInfo, extractTypeIdentifiers, joinPaths, normalizeApiPath } from './shared';

const unwrapGeneric = (typeName: string, wrapper: string): string | null => {
  const t = typeName.trim();
  const h = `${wrapper}<`;
  if (!t.startsWith(h) || !t.endsWith('>')) return null;
  return t.slice(h.length, -1).trim();
};

const cleanTypeString = (raw: string): string => {
  let value = raw.replace(/import\([^)]*\)\./g, '').replace(/\s+/g, ' ').trim();
  while (true) {
    const inner = unwrapGeneric(value, 'Promise') || unwrapGeneric(value, 'globalThis.Promise') || unwrapGeneric(value, 'Observable');
    if (!inner) break;
    value = inner;
  }
  return value;
};

const ensureApiResponseWrapper = (typeString: string): string => {
  if (!typeString || typeString === 'unknown') return 'unknown';
  if (typeString === 'void' || typeString === 'never') return 'void';
  if (typeString.startsWith('ApiResponseDto<')) return typeString;
  return `ApiResponseDto<${typeString}>`;
};

const getDecoratorName = (decorator: ts.Decorator): string | null => {
  const e = decorator.expression;
  if (ts.isCallExpression(e)) {
    if (ts.isIdentifier(e.expression)) return e.expression.text;
    if (ts.isPropertyAccessExpression(e.expression) && ts.isIdentifier(e.expression.name)) return e.expression.name.text;
  }
  if (ts.isIdentifier(e)) return e.text;
  return null;
};

const resolveExpressionToString = (expr: ts.Expression, checker: ts.TypeChecker, depth = 0): string | null => {
  if (depth > 6) return null;
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  if (ts.isParenthesizedExpression(expr)) return resolveExpressionToString(expr.expression, checker, depth + 1);

  const type = checker.getTypeAtLocation(expr);
  if ((type.flags & ts.TypeFlags.StringLiteral) !== 0) return (type as ts.StringLiteralType).value;

  const symbol = checker.getSymbolAtLocation(expr);
  if (!symbol) return null;
  for (const d of symbol.declarations ?? []) {
    if (ts.isEnumMember(d) && d.initializer) {
      const value = resolveExpressionToString(d.initializer, checker, depth + 1);
      if (value !== null) return value;
    }
    if (ts.isVariableDeclaration(d) && d.initializer) {
      const value = resolveExpressionToString(d.initializer, checker, depth + 1);
      if (value !== null) return value;
    }
    if (ts.isPropertyAssignment(d) && d.initializer) {
      const value = resolveExpressionToString(d.initializer, checker, depth + 1);
      if (value !== null) return value;
    }
  }
  return null;
};

const getDecoratorFirstStringArg = (decorator: ts.Decorator, checker: ts.TypeChecker): string | null => {
  const e = decorator.expression;
  if (!ts.isCallExpression(e) || e.arguments.length === 0) return '';
  return resolveExpressionToString(e.arguments[0], checker);
};

const collectControllerFiles = (root: string): string[] => {
  if (!fs.existsSync(root)) return [];
  const out: string[] = [];
  const stack = [root];
  while (stack.length > 0) {
    const cur = stack.pop() as string;
    for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
      const abs = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(abs);
      else if (e.isFile() && e.name.endsWith('.controller.ts')) out.push(abs);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
};

const collectModuleFiles = (root: string): string[] => {
  if (!fs.existsSync(root)) return [];
  const out: string[] = [];
  const stack = [root];
  while (stack.length > 0) {
    const cur = stack.pop() as string;
    for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
      const abs = path.join(cur, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name === 'dist') continue;
        stack.push(abs);
      } else if (e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) {
        out.push(abs);
      }
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
};

const createProgram = (backendRoot: string, files: string[]): ts.Program =>
  ts.createProgram(files, {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    skipLibCheck: true,
    strict: false,
    esModuleInterop: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    baseUrl: backendRoot,
  });

const getTypeText = (checker: ts.TypeChecker, node: ts.Node): string =>
  cleanTypeString(
    checker.typeToString(
      checker.getTypeAtLocation(node),
      node,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    ),
  );

export const resolveTsOperations = (params: {
  backendRoot: string;
  controllersDir: string;
  moduleName: string;
  pathPrefix: string;
}): Array<{
  method: HttpMethod;
  path: string;
  actionName: string;
  responseType: string;
  pathParams: Array<{ name: string; typeName: string }>;
  queryTypeName?: string;
  bodyTypeName?: string;
  bodyRequired: boolean;
  headerParams: Array<{ name: string; typeName: string; required: boolean }>;
}> => {
  const { backendRoot, controllersDir, moduleName, pathPrefix } = params;
  const files = collectControllerFiles(path.join(backendRoot, controllersDir));
  if (files.length === 0) return [];

  const program = createProgram(backendRoot, files);

  const checker = program.getTypeChecker();
  const result: Array<{
    method: HttpMethod;
    path: string;
    actionName: string;
    responseType: string;
    pathParams: Array<{ name: string; typeName: string }>;
    queryTypeName?: string;
    bodyTypeName?: string;
    bodyRequired: boolean;
    headerParams: Array<{ name: string; typeName: string; required: boolean }>;
  }> = [];

  for (const sf of program.getSourceFiles()) {
    if (!sf.fileName.endsWith('.controller.ts')) continue;
    const norm = sf.fileName.replace(/\\/g, '/').toLowerCase();
    if (!norm.includes(`/modules/${moduleName}/controllers/`)) continue;

    for (const st of sf.statements) {
      if (!ts.isClassDeclaration(st) || !st.name) continue;
      const ctrlDec = (ts.getDecorators(st) ?? []).find((d) => getDecoratorName(d) === 'Controller');
      if (!ctrlDec) continue;
      const basePathArg = getDecoratorFirstStringArg(ctrlDec, checker);
      if (basePathArg === null) continue;
      const basePath = normalizeApiPath(basePathArg || '', moduleName);

      for (const m of st.members) {
        if (!ts.isMethodDeclaration(m) || !m.name || !ts.isIdentifier(m.name)) continue;
        const routeDec = (ts.getDecorators(m) ?? []).find((d) => {
          const n = getDecoratorName(d);
          return Boolean(n && ['Get', 'Post', 'Put', 'Patch', 'Delete', 'Options', 'Head'].includes(n));
        });
        if (!routeDec) continue;

        const method = getDecoratorName(routeDec)!.toLowerCase() as HttpMethod;
        const routePathArg = getDecoratorFirstStringArg(routeDec, checker);
        if (routePathArg === null) continue;
        const fullPath = normalizeApiPath(joinPaths(basePath, routePathArg || '', moduleName), moduleName);
        if (!fullPath.startsWith(pathPrefix)) continue;

        const sig = checker.getSignatureFromDeclaration(m);
        if (!sig) continue;
        const type = checker.getReturnTypeOfSignature(sig);
        const raw = checker.typeToString(
          type,
          m,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
        );
        const responseType = ensureApiResponseWrapper(cleanTypeString(raw));

        const pathTokens = [...fullPath.matchAll(/\{([^}]+)\}/g)].map((x) => x[1]);
        const explicitPathParamTypes = new Map<string, string>();
        let queryTypeName: string | undefined;
        let bodyTypeName: string | undefined;
        let bodyRequired = false;
        const headerParams: Array<{ name: string; typeName: string; required: boolean }> = [];

        for (const parameter of m.parameters) {
          const decorators = ts.getDecorators(parameter) ?? [];
          for (const dec of decorators) {
            const decName = getDecoratorName(dec);
            if (!decName) continue;
            if (!['Param', 'Query', 'Body', 'Headers'].includes(decName)) continue;
            const arg = getDecoratorFirstStringArg(dec, checker);
            const typeName = getTypeText(checker, parameter);

            if (decName === 'Param' && arg) {
              explicitPathParamTypes.set(arg, typeName || 'string');
            }
            if (decName === 'Query') {
              queryTypeName = typeName || 'Record<string, unknown>';
            }
            if (decName === 'Body') {
              bodyTypeName = typeName || 'unknown';
              bodyRequired = !parameter.questionToken;
            }
            if (decName === 'Headers' && arg) {
              headerParams.push({
                name: arg,
                typeName: typeName || 'string',
                required: !parameter.questionToken,
              });
            }
          }
        }

        const pathParams = pathTokens.map((token) => ({
          name: token,
          typeName: explicitPathParamTypes.get(token) || 'string',
        }));

        result.push({
          method,
          path: fullPath,
          actionName: m.name.text,
          responseType,
          pathParams,
          queryTypeName,
          bodyTypeName,
          bodyRequired,
          headerParams,
        });
      }
    }
  }

  return result;
};

export const resolveTsRoutes = (params: {
  backendRoot: string;
  controllersDir: string;
  moduleName: string;
  pathPrefix: string;
}): Map<string, TsRouteInfo> => {
  const ops = resolveTsOperations(params);
  const result = new Map<string, TsRouteInfo>();
  for (const op of ops) {
    result.set(`${op.method.toUpperCase()} ${op.path}`, {
      method: op.method,
      path: op.path,
      responseType: op.responseType,
    });
  }
  return result;
};

const getTypeParameterText = (node: ts.NodeArray<ts.TypeParameterDeclaration> | undefined, sf: ts.SourceFile): string => {
  if (!node || node.length === 0) return '';
  return `<${node.map((t) => t.getText(sf)).join(', ')}>`;
};

const getKeysUnionFromMappedArg = (expr: ts.Expression, sf: ts.SourceFile): string => {
  if (!ts.isArrayLiteralExpression(expr)) return expr.getText(sf);
  const keys = expr.elements
    .map((e) => {
      if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return `'${e.text.replace(/'/g, "\\'")}'`;
      if (ts.isIdentifier(e)) return `'${e.text}'`;
      return null;
    })
    .filter((x): x is string => Boolean(x));
  if (keys.length === 0) return 'never';
  return keys.join(' | ');
};

const mapMappedTypeCall = (call: ts.CallExpression, sf: ts.SourceFile): string | null => {
  if (!ts.isIdentifier(call.expression)) return null;
  const helper = call.expression.text;
  const args = call.arguments;
  if (helper === 'PartialType' && args.length >= 1) return `Partial<${args[0].getText(sf)}>`;
  if (helper === 'PickType' && args.length >= 2) {
    return `Pick<${args[0].getText(sf)}, ${getKeysUnionFromMappedArg(args[1], sf)}>`;
  }
  if (helper === 'OmitType' && args.length >= 2) {
    return `Omit<${args[0].getText(sf)}, ${getKeysUnionFromMappedArg(args[1], sf)}>`;
  }
  if (helper === 'IntersectionType' && args.length >= 2) {
    return `${args[0].getText(sf)} & ${args[1].getText(sf)}`;
  }
  return null;
};

const getClassBaseType = (node: ts.ClassDeclaration, sf: ts.SourceFile): string | null => {
  const extendsClause = node.heritageClauses?.find((x) => x.token === ts.SyntaxKind.ExtendsKeyword);
  const base = extendsClause?.types?.[0];
  if (!base) return null;
  const expr = base.expression;
  if (ts.isCallExpression(expr)) {
    const mapped = mapMappedTypeCall(expr, sf);
    if (mapped) return mapped;
  }
  return expr.getText(sf);
};

const emitClassAsInterface = (
  node: ts.ClassDeclaration,
  checker: ts.TypeChecker,
  sf: ts.SourceFile,
): string | null => {
  if (!node.name) return null;
  const typeParams = getTypeParameterText(node.typeParameters, sf);
  const members: string[] = [];
  const baseType = getClassBaseType(node, sf);

  for (const m of node.members) {
    if (!ts.isPropertyDeclaration(m) || !m.name) continue;
    const readonly = m.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ReadonlyKeyword) ? 'readonly ' : '';
    let nameText = '';
    if (ts.isIdentifier(m.name)) nameText = m.name.text;
    else if (ts.isStringLiteral(m.name)) nameText = `'${m.name.text.replace(/'/g, "\\'")}'`;
    else continue;
    const optional = m.questionToken ? '?' : '';
    const typeText = m.type
      ? m.type.getText(sf)
      : checker.typeToString(checker.getTypeAtLocation(m), m, ts.TypeFormatFlags.NoTruncation);
    members.push(`  ${readonly}${nameText}${optional}: ${typeText};`);
  }

  if (members.length === 0) {
    if (baseType) return `export type ${node.name.text}${typeParams} = ${baseType};`;
    return `export interface ${node.name.text}${typeParams} {\n}`;
  }

  if (baseType) {
    return `export type ${node.name.text}${typeParams} = ${baseType} & {\n${members.join('\n')}\n};`;
  }

  return `export interface ${node.name.text}${typeParams} {\n${members.join('\n')}\n}`;
};

const emitDeclaration = (node: ts.Node, checker: ts.TypeChecker, sf: ts.SourceFile): string | null => {
  if (ts.isTypeAliasDeclaration(node)) {
    const typeParams = getTypeParameterText(node.typeParameters, sf);
    return `export type ${node.name.text}${typeParams} = ${node.type.getText(sf)};`;
  }
  if (ts.isInterfaceDeclaration(node)) {
    const typeParams = getTypeParameterText(node.typeParameters, sf);
    const heritage = node.heritageClauses?.map((h) => h.getText(sf)).join(' ') ?? '';
    const members = node.members.map((m) => `  ${m.getText(sf).trim()}`).join('\n');
    return `export interface ${node.name.text}${typeParams}${heritage ? ` ${heritage}` : ''} {\n${members}\n}`;
  }
  if (ts.isEnumDeclaration(node)) {
    const members = node.members
      .map((m) => {
        const name = m.name.getText(sf);
        const value = m.initializer ? ` = ${m.initializer.getText(sf)}` : '';
        return `  ${name}${value},`;
      })
      .join('\n');
    return `export enum ${node.name.text} {\n${members}\n}`;
  }
  if (ts.isClassDeclaration(node)) {
    return emitClassAsInterface(node, checker, sf);
  }
  return null;
};

export const resolveTsTypeDeclarations = (params: {
  backendRoot: string;
  moduleName: string;
  requestedTypeNames: Set<string>;
}): Map<string, string> => {
  const { backendRoot, requestedTypeNames } = params;
  if (requestedTypeNames.size === 0) return new Map();

  const sourceRoot = path.join(backendRoot, 'src');
  const files = collectModuleFiles(sourceRoot);
  if (files.length === 0) return new Map();

  const program = createProgram(backendRoot, files);
  const checker = program.getTypeChecker();
  const declMap = new Map<string, { node: ts.Node; sourceFile: ts.SourceFile }>();

  for (const sf of program.getSourceFiles()) {
    const norm = sf.fileName.replace(/\\/g, '/').toLowerCase();
    if (!norm.includes('/src/')) continue;
    for (const st of sf.statements) {
      if (
        (ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isEnumDeclaration(st) || ts.isClassDeclaration(st)) &&
        st.name
      ) {
        if (!declMap.has(st.name.text)) {
          declMap.set(st.name.text, { node: st, sourceFile: sf });
        }
      }
    }
  }

  const result = new Map<string, string>();
  const queue = [...requestedTypeNames];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const name = queue.shift() as string;
    if (seen.has(name)) continue;
    seen.add(name);
    const target = declMap.get(name);
    if (!target) continue;
    const emitted = emitDeclaration(target.node, checker, target.sourceFile);
    if (!emitted) continue;
    result.set(name, emitted);

    for (const dep of extractTypeIdentifiers(emitted)) {
      if (!seen.has(dep)) queue.push(dep);
    }
  }

  return result;
};
