import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import {
  dedupeParameters,
  extractGenericTypeNames,
  extractTypeIdentifiers,
  GeneratorReport,
  GenMode,
  HttpMethod,
  METHODS,
  normalizeMethodName,
  OpenApiDoc,
  OperationMeta,
  ParameterObject,
  resolveDomain,
  sanitizePropertyName,
  sanitizeTypeName,
} from '../generator/shared';
import { collectRefsFromSchema, getOpenApiResponseType, INLINE_TYPES, pickMediaSchema, schemaToNamedType, schemaToTs } from '../generator/openapi-resolver';
import { resolveTsOperations, resolveTsRoutes, resolveTsTypeDeclarations } from '../generator/ts-resolver';
import { buildConfig, parseArgs } from '../utils';
import { SdkGenConfig } from '../types';

const getGeneratedRoot = (outDir: string): string => path.join(outDir, 'src', 'generated');
const getModuleGeneratedRoot = (outDir: string, moduleName: string): string => path.join(getGeneratedRoot(outDir), moduleName);
const getModuleServicesRoot = (outDir: string, moduleName: string): string => path.join(getModuleGeneratedRoot(outDir, moduleName), 'services');

const ensureDir = (dir: string): void => {
  fs.mkdirSync(dir, { recursive: true });
};
const writeFile = (filePath: string, content: string): void => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
};

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const readOpenApiFromUrl = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    client
      .get(url, (res) => {
        if (!res.statusCode) {
          reject(new Error(`Cannot fetch OpenAPI from URL: ${url}`));
          return;
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`OpenAPI URL responded ${res.statusCode}: ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', (err) => reject(err));
  });

const loadOpenApiDoc = async (source: string): Promise<OpenApiDoc> => {
  if (isHttpUrl(source)) {
    const raw = await readOpenApiFromUrl(source);
    return JSON.parse(raw) as OpenApiDoc;
  }
  if (!fs.existsSync(source)) {
    throw new Error(`OpenAPI file not found: ${source}`);
  }
  return JSON.parse(fs.readFileSync(source, 'utf8')) as OpenApiDoc;
};

const AUTH_HEADERS = new Set(['authorization', 'x-dt-api-token', 'dt-jwt']);

const resolveResponse = (mode: GenMode, openapiType: string, tsType: string): { type: string; source: 'openapi' | 'ts' | 'unknown' } => {
  const hasOpenapi = openapiType !== 'unknown';
  const hasTs = tsType !== 'unknown';
  if (mode === 'openapi') return hasOpenapi ? { type: openapiType, source: 'openapi' } : { type: 'unknown', source: 'unknown' };
  if (mode === 'ts') return hasTs ? { type: tsType, source: 'ts' } : hasOpenapi ? { type: openapiType, source: 'openapi' } : { type: 'unknown', source: 'unknown' };
  return hasOpenapi ? { type: openapiType, source: 'openapi' } : hasTs ? { type: tsType, source: 'ts' } : { type: 'unknown', source: 'unknown' };
};

const renderParamType = (meta: OperationMeta): string => {
  const lines: string[] = [];
  for (const p of meta.pathParams) {
    const type = p.typeName ?? schemaToNamedType(p.schema, `${meta.paramsTypeName}${sanitizeTypeName(p.name)}Path`);
    lines.push(`  ${sanitizePropertyName(p.name)}: ${type};`);
  }
  if (meta.queryTypeName) {
    lines.push(`  query?: ${meta.queryTypeName};`);
  } else if (meta.queryParams.length) {
    const q = meta.queryParams.map((p) => {
      const type = p.typeName ?? schemaToNamedType(p.schema, `${meta.paramsTypeName}${sanitizeTypeName(p.name)}Query`);
      return `    ${sanitizePropertyName(p.name)}${p.required ? '' : '?'}: ${type};`;
    });
    lines.push(`  query?: {\n${q.join('\n')}\n  };`);
  }
  if (meta.bodyTypeName) {
    lines.push(`  body${meta.bodyRequired ? '' : '?'}: ${meta.bodyTypeName};`);
  } else if (meta.bodySchema) {
    lines.push(`  body${meta.bodyRequired ? '' : '?'}: ${schemaToNamedType(meta.bodySchema, `${meta.paramsTypeName}Body`)};`);
  }
  if (meta.headerParams.length) {
    const h = meta.headerParams.map((p) => {
      const type = p.typeName ?? schemaToNamedType(p.schema, `${meta.paramsTypeName}${sanitizeTypeName(p.name)}Header`);
      return `    ${sanitizePropertyName(p.name)}${p.required ? '' : '?'}: ${type};`;
    });
    lines.push(`  headers?: {\n${h.join('\n')}\n  };`);
  }
  if (!lines.length) lines.push('  _?: never;');
  return `export interface ${meta.paramsTypeName} {\n${lines.join('\n')}\n}`;
};

const getDeclaredTypeNames = (lines: string[]): Set<string> => {
  const names = new Set<string>();
  for (const line of lines) {
    const m = line.match(/^export\s+(?:type|interface)\s+([A-Za-z_][A-Za-z0-9_]*)/);
    if (m) names.add(m[1]);
  }
  return names;
};

const renderServiceFile = (domain: string, ops: OperationMeta[]): string => {
  const className = `${sanitizeTypeName(domain)}Service`;
  const imports = [...new Set(ops.flatMap((o) => [o.paramsTypeName, ...extractTypeIdentifiers(o.responseType)]))].sort((a, b) => a.localeCompare(b));
  const importBlock = imports.length ? `import type {\n${imports.map((n) => `  ${n},`).join('\n')}\n} from '../types';\n\n` : '\n';

  const methods = ops
    .map((op) => {
      const hasRequiredBody = Boolean(op.bodyRequired && (op.bodySchema || op.bodyTypeName));
      const optional = op.pathParams.length > 0 || hasRequiredBody ? '' : '?';
      const pathLiteral = op.path.replace(/\{([^}]+)\}/g, '${encodeURIComponent(String(params.$1))}');
      return [
        `  async ${op.methodName}(params${optional}: ${op.paramsTypeName}): Promise<${op.responseType}> {`,
        `    return this.client.request<${op.responseType}>({`,
        `      method: '${op.method.toUpperCase()}',`,
        `      url: \`${pathLiteral}\`,`,
        `      params: ${op.queryParams.length || op.queryTypeName ? 'params?.query' : 'undefined'},`,
        `      data: ${op.bodySchema || op.bodyTypeName ? 'params?.body' : 'undefined'},`,
        `      headers: ${op.headerParams.length ? 'params?.headers' : 'undefined'},`,
        '    });',
        '  }',
      ].join('\n');
    })
    .join('\n\n');

  return `/* eslint-disable */\nimport { HttpClient } from '../../../core/http-client';\n${importBlock}export class ${className} {\n  constructor(private readonly client: HttpClient) {}\n\n${methods}\n}\n`;
};

const toCamelCase = (value: string): string =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, idx) => (idx === 0 ? part.toLowerCase() : part[0].toUpperCase() + part.slice(1).toLowerCase()))
    .join('');

const resolveSdkPropertyName = (domain: string): string => {
  if (domain === 'dynamic-table-auth') return 'authService';
  return toCamelCase(domain);
};

const renderRootSdkIndexFile = (domains: string[]): string => {
  const services = domains
    .map((domain) => ({
      className: `${sanitizeTypeName(domain)}Service`,
      propertyName: resolveSdkPropertyName(domain),
      domain,
    }))
    .sort((a, b) => a.className.localeCompare(b.className));

  const importNames = services.map((service) => service.className).join(', ');
  const hasViewColumns = services.some((service) => service.className === 'ViewColumnsService');
  const objectLines: string[] = ['    auth,'];
  for (const service of services) {
    if (hasViewColumns && service.className === 'ViewColumnsService') continue;
    objectLines.push(`    ${service.propertyName}: new ${service.className}(client),`);
  }
  if (hasViewColumns) {
    objectLines.push('    formColumns: viewColumns,');
    objectLines.push('    gridColumns: viewColumns,');
    objectLines.push('    viewColumns,');
  }

  return `import { DynamicTableAuth } from './core/auth';
import { HttpClient } from './core/http-client';
import { DynamicTableSdkConfig, DynamicTableTokenProvider } from './core/types';
import { ${importNames} } from './generated/services';

export type { ApiResponseDto, DynamicTableSdkConfig, DynamicTableTokenProvider } from './core/types';
export * from './generated';

export const createFrontendAxiosTokenProvider = (options?: {
  authStorageKey?: string;
  dtApiToken?: string | null;
  getDtApiToken?: () => string | null | undefined;
}) => {
  const authStorageKey = options?.authStorageKey ?? 'auth_data';
  return {
    getBearerToken: () => {
      const storage = (globalThis as { localStorage?: { getItem: (key: string) => string | null } }).localStorage;
      if (!storage) return null;
      try {
        const raw = storage.getItem(authStorageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { accessToken?: string; expiresAt?: number };
        if (!parsed?.accessToken) return null;
        if (typeof parsed.expiresAt === 'number' && parsed.expiresAt <= Date.now()) return null;
        return parsed.accessToken;
      } catch {
        return null;
      }
    },
    getDtApiToken: () => options?.getDtApiToken?.() ?? options?.dtApiToken ?? null,
  } as const;
};

export const createDynamicTableSdk = (config: DynamicTableSdkConfig) => {
  const auth = new DynamicTableAuth({ bearerToken: config.bearerToken ?? null, dtApiToken: config.dtApiToken ?? null }, config.tokenProvider);
  const client = new HttpClient(config, auth);
${hasViewColumns ? '  const viewColumns = new ViewColumnsService(client);\n' : ''}  return {
${objectLines.join('\n')}
  };
};
`;
};

export const runGenerate = async (cfg: SdkGenConfig): Promise<void> => {
  if (!['openapi', 'ts', 'hybrid'].includes(cfg.mode)) throw new Error(`Invalid mode: ${cfg.mode}`);
  if (cfg.mode !== 'ts' && !cfg.openApiSource) {
    throw new Error('openApiSource is required for openapi/hybrid mode');
  }
  const doc = cfg.mode === 'ts' ? null : await loadOpenApiDoc(cfg.openApiSource as string);
  const tsMap = cfg.mode === 'openapi' ? new Map<string, { responseType: string; controllerDomain: string }>() : resolveTsRoutes({
    backendRoot: cfg.backendRoot,
    controllersDir: cfg.controllersDir,
    moduleName: cfg.moduleName,
    pathPrefix: cfg.pathPrefix,
  });
  const tsOperations = cfg.mode === 'ts'
    ? resolveTsOperations({
      backendRoot: cfg.backendRoot,
      controllersDir: cfg.controllersDir,
      moduleName: cfg.moduleName,
      pathPrefix: cfg.pathPrefix,
    })
    : [];

  const report: GeneratorReport = {
    moduleName: cfg.moduleName,
    mode: cfg.mode,
    totalOperations: 0,
    resolvedByOpenapi: 0,
    resolvedByTs: 0,
    unresolved: [],
    conflicts: [],
  };

  const operations: OperationMeta[] = [];
  const usedRefs = new Set<string>();
  const fallbackTypeNames = new Set<string>();
  const genericFallbackTypeNames = new Set<string>();

  if (cfg.mode === 'ts') {
    for (const op of tsOperations) {
      report.totalOperations += 1;
      report.resolvedByTs += 1;
      for (const t of extractTypeIdentifiers(op.responseType)) fallbackTypeNames.add(t);
      for (const t of extractGenericTypeNames(op.responseType)) genericFallbackTypeNames.add(t);
      for (const p of op.pathParams) for (const t of extractTypeIdentifiers(p.typeName)) fallbackTypeNames.add(t);
      if (op.queryTypeName) for (const t of extractTypeIdentifiers(op.queryTypeName)) fallbackTypeNames.add(t);
      if (op.bodyTypeName) for (const t of extractTypeIdentifiers(op.bodyTypeName)) fallbackTypeNames.add(t);
      for (const h of op.headerParams) for (const t of extractTypeIdentifiers(h.typeName)) fallbackTypeNames.add(t);

      const operationId = `${op.method}_${op.path.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const methodName = normalizeMethodName(op.actionName || operationId, op.method, op.path);
        operations.push({
          path: op.path,
          method: op.method,
          operationId,
          domain: op.controllerDomain || resolveDomain(op.path, cfg.pathPrefix),
          methodName,
          responseType: op.responseType,
          responseSource: 'ts',
        paramsTypeName: `${sanitizeTypeName(methodName)}Params`,
        pathParams: op.pathParams.map((p) => ({ name: p.name, in: 'path', required: true, typeName: p.typeName })),
        queryParams: [],
        headerParams: op.headerParams.map((h) => ({ name: h.name, in: 'header', required: h.required, typeName: h.typeName })),
        queryTypeName: op.queryTypeName,
        bodyTypeName: op.bodyTypeName,
        bodySchema: undefined,
        bodyRequired: op.bodyRequired,
      });
    }
  } else {
    for (const [rawPath, pathItem] of Object.entries(doc!.paths)) {
      const apiPath = rawPath.replace(/\/+/g, '/').replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
      if (!apiPath.startsWith(cfg.pathPrefix)) continue;

      for (const method of METHODS) {
        const operation = (pathItem as Record<string, any>)[method] as any;
        if (!operation) continue;
        report.totalOperations += 1;

        const params = dedupeParameters((pathItem as { parameters?: ParameterObject[] }).parameters, operation.parameters);
        const pathParams = params.filter((p) => p.in === 'path');
        const queryParams = params.filter((p) => p.in === 'query');
        const headerParams = params.filter((p) => p.in === 'header' && !AUTH_HEADERS.has(p.name.toLowerCase()));
        const bodySchema = pickMediaSchema(operation.requestBody?.content);
        const bodyRequired = Boolean(operation.requestBody?.required);

        const operationId = operation.operationId || `${method}_${apiPath.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const methodName = normalizeMethodName(operationId, method, apiPath);
        const paramsTypeName = `${sanitizeTypeName(methodName)}Params`;

        const openapiType = getOpenApiResponseType(operation, sanitizeTypeName(methodName));
        const tsRoute = tsMap.get(`${method.toUpperCase()} ${apiPath}`);
        const tsType = tsRoute?.responseType ?? 'unknown';
        const resolved = resolveResponse(cfg.mode, openapiType, tsType);

        if (openapiType !== 'unknown' && tsType !== 'unknown' && openapiType.replace(/\s+/g, '') !== tsType.replace(/\s+/g, '')) {
          report.conflicts.push({ method: method.toUpperCase(), path: apiPath, operationId, openapiType, tsType });
        }

        if (resolved.source === 'openapi') report.resolvedByOpenapi += 1;
        if (resolved.source === 'ts') {
          report.resolvedByTs += 1;
          for (const t of extractTypeIdentifiers(resolved.type)) fallbackTypeNames.add(t);
          for (const t of extractGenericTypeNames(resolved.type)) genericFallbackTypeNames.add(t);
        }
        if (resolved.source === 'unknown') report.unresolved.push({ method: method.toUpperCase(), path: apiPath, operationId });

        collectRefsFromSchema(bodySchema, usedRefs);
        for (const p of params) collectRefsFromSchema(p.schema, usedRefs);

        operations.push({
          path: apiPath,
          method,
          operationId,
          domain: tsRoute?.controllerDomain || resolveDomain(apiPath, cfg.pathPrefix),
          methodName,
          responseType: resolved.type,
          responseSource: resolved.source,
          paramsTypeName,
          pathParams,
          queryParams,
          headerParams,
          bodySchema,
          bodyRequired,
        });
      }
    }
  }

  operations.sort((a, b) => `${a.domain}:${a.path}:${a.method}`.localeCompare(`${b.domain}:${b.path}:${b.method}`));

  const generatedRoot = getGeneratedRoot(cfg.outDir);
  const moduleGeneratedRoot = getModuleGeneratedRoot(cfg.outDir, cfg.moduleName);
  const moduleServicesRoot = getModuleServicesRoot(cfg.outDir, cfg.moduleName);

  ensureDir(generatedRoot);
  ensureDir(moduleGeneratedRoot);
  ensureDir(moduleServicesRoot);
  for (const f of fs.readdirSync(moduleServicesRoot)) fs.unlinkSync(path.join(moduleServicesRoot, f));

  const schemas = doc?.components?.schemas ?? {};
  const refs = new Set<string>(usedRefs);
  const queue = [...refs];
  const enqueued = new Set(queue);
  while (queue.length > 0) {
    const name = queue.shift() as string;
    const schema = schemas[name];
    if (!schema) continue;
    const before = new Set(refs);
    collectRefsFromSchema(schema, refs);
    for (const n of refs) {
      if (!before.has(n) && !enqueued.has(n)) {
        queue.push(n);
        enqueued.add(n);
      }
    }
  }

  const componentTypes = [...refs]
    .filter((n) => Boolean(schemas[n]))
    .map((n) => `export type ${sanitizeTypeName(n)} = ${schemaToTs(schemas[n], sanitizeTypeName(n))};`)
    .sort((a, b) => a.localeCompare(b));

  const paramTypes = operations.map(renderParamType).sort((a, b) => a.localeCompare(b));
  const declared = getDeclaredTypeNames([...componentTypes, ...INLINE_TYPES, ...paramTypes]);
  const needsApiResponseAlias = operations.some((op) => op.responseType.includes('ApiResponseDto<'));

  const aliasLines = needsApiResponseAlias && !declared.has('ApiResponseDto')
    ? ["export type ApiResponseDto<T = unknown> = import('../../core/types').ApiResponseDto<T>;"]
    : [];

  const missingTypes = new Set(
    [...fallbackTypeNames].filter((n) => n !== 'ApiResponseDto' && !declared.has(n)),
  );
  const resolvedTsDeclarations = resolveTsTypeDeclarations({
    backendRoot: cfg.backendRoot,
    moduleName: cfg.moduleName,
    requestedTypeNames: missingTypes,
  });

  for (const resolvedName of resolvedTsDeclarations.keys()) {
    missingTypes.delete(resolvedName);
  }

  const resolvedDeclarationLines = [...resolvedTsDeclarations.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, declaration]) => declaration);

  const fallbackPlaceholders = [...missingTypes]
    .map((n) => (genericFallbackTypeNames.has(n) ? `export type ${n}<T = unknown> = unknown;` : `export type ${n} = unknown;`))
    .sort((a, b) => a.localeCompare(b));

  writeFile(
    path.join(moduleGeneratedRoot, 'types.ts'),
    [
      '/* eslint-disable */',
      ...aliasLines,
      ...(aliasLines.length ? [''] : []),
      ...componentTypes,
      '',
      ...INLINE_TYPES,
      '',
      ...resolvedDeclarationLines,
      ...(resolvedDeclarationLines.length ? [''] : []),
      ...fallbackPlaceholders,
      ...(fallbackPlaceholders.length ? [''] : []),
      ...paramTypes,
      '',
    ].join('\n'),
  );

  const byDomain = new Map<string, OperationMeta[]>();
  for (const op of operations) {
    const list = byDomain.get(op.domain) ?? [];
    list.push(op);
    byDomain.set(op.domain, list);
  }

  const exports: string[] = [];
  for (const [domain, ops] of [...byDomain.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    writeFile(path.join(moduleServicesRoot, `${domain}.service.ts`), renderServiceFile(domain, ops));
    exports.push(`export { ${sanitizeTypeName(domain)}Service } from './${domain}.service';`);
  }

  writeFile(path.join(moduleServicesRoot, 'index.ts'), `/* eslint-disable */\n${exports.join('\n')}\n`);
  writeFile(
    path.join(moduleGeneratedRoot, 'index.ts'),
    `/* eslint-disable */\nexport * from './types';\nexport * from './services';\n`,
  );

  // Compatibility barrels at root src/generated for existing imports.
  writeFile(path.join(generatedRoot, 'types.ts'), `/* eslint-disable */\nexport * from './${cfg.moduleName}/types';\n`);
  writeFile(path.join(generatedRoot, 'services', 'index.ts'), `/* eslint-disable */\nexport * from '../${cfg.moduleName}/services';\n`);
  writeFile(
    path.join(generatedRoot, 'index.ts'),
    `/* eslint-disable */\nexport * from './types';\nexport * from './services';\nexport * as ${sanitizeTypeName(cfg.moduleName).replace(/^[A-Z]/, (c) => c.toLowerCase())} from './${cfg.moduleName}';\n`,
  );
  if (cfg.syncRootIndex) {
    const sortedDomains = [...byDomain.keys()].sort((a, b) => a.localeCompare(b));
    writeFile(path.join(cfg.outDir, 'src', 'index.ts'), renderRootSdkIndexFile(sortedDomains));
  }

  const reportPath = path.join(cfg.outDir, 'tools', '.reports', `${cfg.moduleName}-sdk-report.json`);
  if (cfg.outputReport) writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Generated ${operations.length} operations across ${byDomain.size} domains. module=${cfg.moduleName} mode=${cfg.mode}`);
  console.log(`Resolved: openapi=${report.resolvedByOpenapi}, ts=${report.resolvedByTs}, unknown=${report.unresolved.length}`);
};

export const runGenerateFromArgs = async (): Promise<void> => {
  const cfg = buildConfig(parseArgs());
  await runGenerate(cfg);
};

if (require.main === module) {
  runGenerateFromArgs().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

