export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';
export type GenMode = 'openapi' | 'ts' | 'hybrid';
export type ResolveSource = 'openapi' | 'ts' | 'unknown';

export type SchemaObject = {
  $ref?: string;
  type?: string;
  format?: string;
  enum?: Array<string | number | boolean | null>;
  nullable?: boolean;
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  allOf?: SchemaObject[];
  additionalProperties?: boolean | SchemaObject;
};

export type ParameterObject = {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  schema?: SchemaObject;
};

export type RequestBodyObject = {
  required?: boolean;
  content?: Record<string, { schema?: SchemaObject }>;
};

export type OperationObject = {
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses?: Record<string, { content?: Record<string, { schema?: SchemaObject }> }>;
};

export type OpenApiDoc = {
  openapi: string;
  paths: Record<string, Record<string, OperationObject> & { parameters?: ParameterObject[] }>;
  components?: { schemas?: Record<string, SchemaObject> };
};

export type OperationMeta = {
  path: string;
  method: HttpMethod;
  operationId: string;
  domain: string;
  methodName: string;
  responseType: string;
  responseSource: ResolveSource;
  paramsTypeName: string;
  pathParams: OperationParamMeta[];
  queryParams: OperationParamMeta[];
  headerParams: OperationParamMeta[];
  queryTypeName?: string;
  bodySchema?: SchemaObject;
  bodyTypeName?: string;
  bodyRequired: boolean;
};

export type TsRouteInfo = { method: HttpMethod; path: string; responseType: string; controllerDomain: string };
export type OperationParamMeta = ParameterObject & { typeName?: string };
export type TsResolvedOperation = {
  method: HttpMethod;
  path: string;
  actionName: string;
  controllerDomain: string;
  responseType: string;
  pathParams: Array<{ name: string; typeName: string }>;
  queryTypeName?: string;
  bodyTypeName?: string;
  bodyRequired: boolean;
  headerParams: Array<{ name: string; typeName: string; required: boolean }>;
};

export type GeneratorReport = {
  moduleName: string;
  mode: GenMode;
  totalOperations: number;
  resolvedByOpenapi: number;
  resolvedByTs: number;
  unresolved: Array<{ method: string; path: string; operationId: string }>;
  conflicts: Array<{ method: string; path: string; operationId: string; openapiType: string; tsType: string }>;
};

export const METHODS: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

export const sanitizeTypeName = (s: string): string =>
  (s.replace(/[^a-zA-Z0-9_]/g, '_').split(/[_\-\s]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join('')) || 'UnnamedType';

export const sanitizePropertyName = (n: string): string => (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n) ? n : `'${n.replace(/'/g, "\\'")}'`);

export const normalizeApiPath = (p: string, prependV1ForModule?: string): string => {
  const v = (p.startsWith('/') ? p : `/${p}`).replace(/\/+/g, '/').replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
  const withPrefix = prependV1ForModule && v.startsWith(`/${prependV1ForModule}`) ? `/v1${v}` : v;
  return withPrefix.length > 1 && withPrefix.endsWith('/') ? withPrefix.slice(0, -1) : withPrefix;
};

export const joinPaths = (a: string, b: string, modulePrefix?: string): string => normalizeApiPath(`${a.trim()}/${b.trim()}`, modulePrefix);

export const parseBool = (v: string | undefined, d: boolean): boolean => (!v ? d : ['1', 'true', 'yes', 'on'].includes(v.toLowerCase()));

export const getRefTypeName = (ref: string): string => sanitizeTypeName(ref.split('/').pop() || 'UnknownRef');

export const normalizeNullable = (base: string, nullable?: boolean): string => (nullable ? `${base} | null` : base);

export const primitiveForType = (type?: string, format?: string): string => {
  if (!type) return 'unknown';
  if (type === 'integer' || type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return format === 'binary' ? 'Blob' : 'string';
  if (type === 'null') return 'null';
  if (type === 'object') return 'Record<string, unknown>';
  if (type === 'array') return 'unknown[]';
  return 'unknown';
};

export const dedupeParameters = (a: ParameterObject[] | undefined, b: ParameterObject[] | undefined): ParameterObject[] => {
  const map = new Map<string, ParameterObject>();
  for (const p of [...(a ?? []), ...(b ?? [])]) map.set(`${p.in}:${p.name}`, p);
  return [...map.values()];
};

export const fallbackMethodName = (method: HttpMethod, apiPath: string): string => {
  const parts = apiPath.split('/').filter(Boolean).map((s) => (s.startsWith('{') ? `By${sanitizeTypeName(s.replace(/[{}]/g, ''))}` : sanitizeTypeName(s)));
  return `${method}${parts.join('')}`.replace(/^[A-Z]/, (c) => c.toLowerCase());
};

export const normalizeMethodName = (operationId: string, method: HttpMethod, apiPath: string): string => {
  if (!operationId.trim()) return fallbackMethodName(method, apiPath);
  const stripped = operationId.replace(/^[^_]+_/, '');
  const camel = stripped.replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase());
  return camel || fallbackMethodName(method, apiPath);
};

export const resolveDomain = (apiPath: string, pathPrefix: string): string => {
  const cleanPrefix = pathPrefix.replace(/\/$/, '');
  const metaPrefix = `${cleanPrefix}/db/meta/`;
  const dataPrefix = `${cleanPrefix}/db/data/`;
  if (apiPath.startsWith(metaPrefix)) return (apiPath.slice(metaPrefix.length).split('/').filter(Boolean)[0] || 'meta').toLowerCase();
  if (apiPath.startsWith(dataPrefix)) return 'data-table';
  if (apiPath.startsWith(`${cleanPrefix}/`)) return (apiPath.slice(`${cleanPrefix}/`.length).split('/').filter(Boolean)[0] || 'common').toLowerCase();
  return 'common';
};

export const BUILTIN_TYPE_NAMES = new Set(['string', 'number', 'boolean', 'unknown', 'void', 'null', 'undefined', 'never', 'any', 'Record', 'Array', 'Blob', 'Date', 'Object', 'Promise', 'ReadonlyArray', 'Partial', 'Pick', 'Omit', 'Required']);

export const extractTypeIdentifiers = (typeExpr: string): string[] => {
  const m = typeExpr.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
  return [...new Set(m.filter((n) => !BUILTIN_TYPE_NAMES.has(n) && /^[A-Z]/.test(n)))];
};

export const extractGenericTypeNames = (typeExpr: string): string[] => {
  const out = new Set<string>();
  const regex = /([A-Za-z_][A-Za-z0-9_]*)\s*</g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(typeExpr)) !== null) {
    if (!BUILTIN_TYPE_NAMES.has(match[1]) && /^[A-Z]/.test(match[1])) out.add(match[1]);
  }
  return [...out];
};
