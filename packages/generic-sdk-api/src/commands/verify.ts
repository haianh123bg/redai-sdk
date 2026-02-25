import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';
import { resolveTsOperations } from '../generator/ts-resolver';
import { normalizeMethodName, sanitizeTypeName } from '../generator/shared';
import { buildConfig, parseArgs } from '../utils';
import { SdkGenConfig } from '../types';

const normalizeType = (value: string): string => value.replace(/\s+/g, '').replace(/import\([^)]*\)\./g, '').trim();

export const runVerify = async (cfg: SdkGenConfig): Promise<void> => {
  const backendOps = resolveTsOperations({
    backendRoot: cfg.backendRoot,
    controllersDir: cfg.controllersDir,
    moduleName: cfg.moduleName,
    pathPrefix: cfg.pathPrefix,
  });

  const typesPath = path.join(cfg.outDir, 'src', 'generated', cfg.moduleName, 'types.ts');
  const servicesDir = path.join(cfg.outDir, 'src', 'generated', cfg.moduleName, 'services');

  if (!fs.existsSync(typesPath)) throw new Error(`Missing generated types file: ${typesPath}`);
  if (!fs.existsSync(servicesDir)) throw new Error(`Missing generated services directory: ${servicesDir}`);

  const sourceText = fs.readFileSync(typesPath, 'utf8');
  const sourceFile = ts.createSourceFile(typesPath, sourceText, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
  const interfaceMap = new Map<string, ts.InterfaceDeclaration>();
  const typeAliasMap = new Map<string, ts.TypeAliasDeclaration>();
  for (const st of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(st)) interfaceMap.set(st.name.text, st);
    if (ts.isTypeAliasDeclaration(st)) typeAliasMap.set(st.name.text, st);
  }

  const generatedMethods = new Map<string, { responseType: string; paramsType: string }>();
  const serviceFiles = fs.readdirSync(servicesDir).filter((f) => f.endsWith('.service.ts'));
  for (const file of serviceFiles) {
    const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
    const regex = /async\s+\w+\(params\??:\s*(\w+)\):\s*Promise<([^>]+(?:>[^\n]*)?)>\s*\{[\s\S]*?method:\s*'([A-Z]+)'[\s\S]*?url:\s*`([^`]+)`/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const paramsType = match[1].trim();
      const responseType = match[2].trim();
      const method = match[3].toUpperCase();
      const apiPath = match[4].replace(/\$\{encodeURIComponent\(String\(params\.([^\)]+)\)\)\}/g, '{$1}');
      generatedMethods.set(`${method} ${apiPath}`, { responseType, paramsType });
    }
  }

  const mismatches: Array<Record<string, unknown>> = [];
  for (const op of backendOps) {
    const key = `${op.method.toUpperCase()} ${op.path}`;
    const generated = generatedMethods.get(key);
    const operationId = `${op.method}_${op.path.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const methodName = normalizeMethodName(op.actionName || operationId, op.method, op.path);
    const expectedParamsName = `${sanitizeTypeName(methodName)}Params`;

    if (!generated) {
      mismatches.push({ key, reason: 'missing_service_method' });
      continue;
    }
    if (normalizeType(generated.responseType) !== normalizeType(op.responseType)) {
      mismatches.push({ key, reason: 'response_type_mismatch' });
    }
    if (generated.paramsType !== expectedParamsName) {
      mismatches.push({ key, reason: 'params_type_name_mismatch', expected: expectedParamsName, actual: generated.paramsType });
    }

    const paramsInterface = interfaceMap.get(expectedParamsName);
    if (!paramsInterface) {
      mismatches.push({ key, reason: 'missing_params_interface' });
      continue;
    }

    const props = new Map<string, { type: string; optional: boolean }>();
    for (const member of paramsInterface.members) {
      if (!ts.isPropertySignature(member) || !member.type || !member.name) continue;
      const name = ts.isIdentifier(member.name) ? member.name.text : ts.isStringLiteral(member.name) ? member.name.text : '';
      if (!name) continue;
      props.set(name, { type: member.type.getText(sourceFile), optional: Boolean(member.questionToken) });
    }

    for (const p of op.pathParams) {
      const got = props.get(p.name);
      if (!got || normalizeType(got.type) !== normalizeType(p.typeName || 'string') || got.optional) {
        mismatches.push({ key, reason: 'path_param_mismatch', param: p.name });
      }
    }

    if (op.queryTypeName) {
      const q = props.get('query');
      if (!q || normalizeType(q.type) !== normalizeType(op.queryTypeName)) mismatches.push({ key, reason: 'query_mismatch' });
    }

    if (op.bodyTypeName) {
      const b = props.get('body');
      if (!b || normalizeType(b.type) !== normalizeType(op.bodyTypeName) || b.optional === op.bodyRequired) {
        mismatches.push({ key, reason: 'body_mismatch' });
      }
    }
  }

  const unknownAliases = [...typeAliasMap.values()]
    .filter((x) => /unknown/.test(x.type.getText(sourceFile)) && x.name.text !== 'ApiResponseDto')
    .map((x) => x.name.text);

  const summary = {
    module: cfg.moduleName,
    backendOperationCount: backendOps.length,
    generatedOperationCount: generatedMethods.size,
    mismatchCount: mismatches.length,
    unknownAliasCount: unknownAliases.length,
    sampleMismatches: mismatches.slice(0, 10),
  };
  console.log(JSON.stringify(summary, null, 2));

  if (mismatches.length > 0 || unknownAliases.length > 0) process.exit(1);
};

export const runVerifyFromArgs = async (): Promise<void> => {
  const cfg = buildConfig(parseArgs());
  await runVerify(cfg);
};

if (require.main === module) {
  runVerifyFromArgs().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
