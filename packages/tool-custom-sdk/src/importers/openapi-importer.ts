import { parse as parseYaml } from 'yaml';

import {
  ApiOperation,
  HttpMethod,
  RequestBodyField,
  RequestBodyMode,
  RequestDefinition,
  RequestParamItem,
  ResponseDefinition,
} from '../types/ir';
import { Schema, SchemaType } from '../types/schema';

type RefObject = { $ref: string };

type OpenApiDocument = {
  openapi?: string;
  swagger?: string;
  servers?: Array<{ url?: string }>;
  components?: { schemas?: Record<string, SchemaObject> };
  paths?: Record<string, PathItemObject>;
  [key: string]: unknown;
};

type PathItemObject = {
  parameters?: ParameterObject[];
  [method: string]: unknown;
};

type SchemaObject = {
  type?: string | string[];
  title?: string;
  description?: string;
  nullable?: boolean;
  enum?: unknown[];
  format?: string;
  items?: SchemaObject | RefObject;
  properties?: Record<string, SchemaObject | RefObject>;
  required?: string[];
  additionalProperties?: boolean | SchemaObject | RefObject;
  minItems?: number;
  maxItems?: number;
  minProperties?: number;
  maxProperties?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  example?: unknown;
  default?: unknown;
  allOf?: Array<SchemaObject | RefObject>;
  oneOf?: Array<SchemaObject | RefObject>;
  anyOf?: Array<SchemaObject | RefObject>;
  not?: SchemaObject | RefObject;
  [key: string]: unknown;
};

type ParameterObject = {
  name?: string;
  in?: 'path' | 'query' | 'header' | 'cookie' | string;
  required?: boolean;
  description?: string;
  schema?: SchemaObject | RefObject;
  $ref?: string;
  [key: string]: unknown;
};

type RequestBodyObject = {
  required?: boolean;
  content?: Record<string, MediaTypeObject>;
  $ref?: string;
  [key: string]: unknown;
};

type OperationObject = {
  operationId?: string;
  description?: string;
  summary?: string;
  tags?: string[];
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject | RefObject;
  responses?: Record<string, ResponseObject | RefObject>;
  [key: string]: unknown;
};

type ResponseObject = {
  description?: string;
  content?: Record<string, MediaTypeObject>;
  [key: string]: unknown;
};

type MediaTypeObject = {
  schema?: SchemaObject | RefObject;
  [key: string]: unknown;
};

export interface ImportOpenApiOptions {
  collectionId: string;
  versionId: string;
  defaultBaseUrlVar?: string;
  tagAsFolder?: boolean;
}

export interface ImportOpenApiResult {
  operations: ApiOperation[];
}

export interface ImportOpenApiValidationResult {
  valid: boolean;
  errors: string[];
}

export class OpenApiImporter {
  import(input: { spec: string | OpenApiDocument; options: ImportOpenApiOptions }): ImportOpenApiResult {
    const doc = typeof input.spec === 'string' ? parseOpenApiString(input.spec) : input.spec;
    const validation = validateOpenApiDocument(doc);
    if (!validation.valid) {
      throw new Error(`Invalid OpenAPI document: ${validation.errors.join('; ')}`);
    }

    const baseUrlVar = input.options.defaultBaseUrlVar ?? 'baseUrl';
    const serverUrl = doc.servers?.[0]?.url;
    const baseUrlTemplate = `{{${baseUrlVar}}}`;

    const operations: ApiOperation[] = [];
    const toolNameCounts = new Map<string, number>();

    const paths = doc.paths ?? {};
    for (const pathKey of Object.keys(paths).sort()) {
      const pathItem = paths[pathKey] ?? {};
      const pathLevelParameters: ParameterObject[] = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];

      const methods = Object.keys(pathItem).filter((k: string) => isHttpMethodKey(k)).sort();
      for (const methodKey of methods) {
        const op = pathItem[methodKey] as OperationObject | undefined;
        if (!op) continue;

        const method = methodKey.toUpperCase() as HttpMethod;

        const rawOperationId = op.operationId ?? buildFallbackOperationId(method, pathKey);
        const toolNameBase = normalizeToolName(rawOperationId);
        const toolName = ensureUniqueToolName(toolNameBase, toolNameCounts);

        const description = op.description ?? op.summary;
        const tags = Array.isArray(op.tags) ? op.tags : undefined;

        const mergedParams: ParameterObject[] = [...pathLevelParameters, ...(Array.isArray(op.parameters) ? op.parameters : [])];
        const paramsResolved = mergedParams
          .map((p: ParameterObject) => deref<ParameterObject>(doc, p))
          .filter((p: ParameterObject | undefined): p is ParameterObject => Boolean(p));

        const schemaParams: {
          doc: OpenApiDocument;
          serverUrl?: string;
          baseUrlTemplate: string;
          collectionId: string;
          versionId: string;
          toolName: string;
          method: HttpMethod;
          pathKey: string;
          parameters: ParameterObject[];
          requestBody?: RequestBodyObject | RefObject;
        } = {
          doc,
          baseUrlTemplate,
          collectionId: input.options.collectionId,
          versionId: input.options.versionId,
          toolName,
          method,
          pathKey,
          parameters: paramsResolved,
        };
        if (serverUrl !== undefined) {
          schemaParams.serverUrl = serverUrl;
        }
        if (op.requestBody !== undefined) {
          schemaParams.requestBody = op.requestBody;
        }

        const { toolInputSchema, requestDefinition } = this.buildSchemasAndRequestDefinition(schemaParams);
        const responses = buildResponses(doc, op.responses);
        const operation: ApiOperation = {
          id: `${input.options.collectionId}:${input.options.versionId}:${method}:${pathKey}`,
          collectionId: input.options.collectionId,
          versionId: input.options.versionId,
          toolName,
          method,
          path: pathKey,
          name: rawOperationId,
          toolInputSchema,
          requestDefinition,
        };
        if (description !== undefined) operation.description = description;
        if (tags !== undefined) operation.tags = tags;
        if (responses !== undefined) operation.responses = responses;
        operations.push(operation);
      }
    }

    return { operations };
  }

  validate(input: { spec: string | OpenApiDocument }): ImportOpenApiValidationResult {
    try {
      const doc = typeof input.spec === 'string' ? parseOpenApiString(input.spec) : input.spec;
      return validateOpenApiDocument(doc);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { valid: false, errors: [message] };
    }
  }

  private buildSchemasAndRequestDefinition(params: {
    doc: OpenApiDocument;
    serverUrl?: string;
    baseUrlTemplate: string;
    collectionId: string;
    versionId: string;
    toolName: string;
    method: HttpMethod;
    pathKey: string;
    parameters: ParameterObject[];
    requestBody?: RequestBodyObject | RefObject;
  }): { toolInputSchema: Schema; requestDefinition: RequestDefinition } {
    const pathParams = params.parameters.filter((p: ParameterObject) => p.in === 'path');
    const queryParams = params.parameters.filter((p: ParameterObject) => p.in === 'query');
    const headerParams = params.parameters.filter((p: ParameterObject) => p.in === 'header');
    const cookieParams = params.parameters.filter((p: ParameterObject) => p.in === 'cookie');

    const pathSchema = buildParamsObjectSchema(params.doc, pathParams);
    const querySchema = buildParamsObjectSchema(params.doc, queryParams);
    const headersSchema = buildParamsObjectSchema(params.doc, headerParams);
    const cookiesSchema = buildParamsObjectSchema(params.doc, cookieParams);

    const pathItems: RequestParamItem[] = pathParams.map((p: ParameterObject) => createRequestParamItem(p.name ?? '', p.description));

    const queryItems: RequestParamItem[] = queryParams.map((p: ParameterObject) => createRequestParamItem(p.name ?? '', p.description));

    const headerItems: RequestParamItem[] = headerParams.map((p: ParameterObject) => createRequestParamItem(p.name ?? '', p.description));

    const cookieItems: RequestParamItem[] = cookieParams.map((p: ParameterObject) => createRequestParamItem(p.name ?? '', p.description));

    const { bodySchema, bodyRequired, bodyDefinition } = buildRequestBody(params.doc, params.requestBody);

    const properties: { [key: string]: Schema } = {};
    const required: string[] = [];

    if (pathSchema) {
      properties.path = pathSchema;
      if ((pathSchema.required ?? []).length > 0) required.push('path');
    }

    if (querySchema) {
      properties.query = querySchema;
      if ((querySchema.required ?? []).length > 0) required.push('query');
    }

    if (headersSchema) {
      properties.headers = headersSchema;
      if ((headersSchema.required ?? []).length > 0) required.push('headers');
    }

    if (cookiesSchema) {
      properties.cookies = cookiesSchema;
      if ((cookiesSchema.required ?? []).length > 0) required.push('cookies');
    }

    if (bodySchema) {
      properties.body = bodySchema;
      if (bodyRequired) required.push('body');
    }

    const toolInputSchema: Schema = {
      type: SchemaType.OBJECT,
      properties,
      ...(required.length > 0 ? { required } : {}),
    };

    const urlTemplate = `${params.baseUrlTemplate}${convertOasPathToMustache(params.pathKey)}`;

    const requestDefinition: RequestDefinition = {
      id: `${params.collectionId}:${params.versionId}:${params.method}:${params.pathKey}`,
      operationId: params.toolName,
      urlTemplate,
      method: params.method,
      pathParams: pathItems,
      queryParams: queryItems,
      headers: headerItems,
      cookies: cookieItems,
    };
    if (params.serverUrl !== undefined) requestDefinition.baseUrl = params.serverUrl;
    if (bodyDefinition !== undefined) requestDefinition.body = bodyDefinition;

    return { toolInputSchema, requestDefinition };
  }
}

function parseOpenApiString(input: string): OpenApiDocument {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('OpenAPI spec is empty');
  }

  let jsonError: unknown;

  if (looksLikeJson(trimmed)) {
    try {
      return JSON.parse(trimmed) as OpenApiDocument;
    } catch (err) {
      jsonError = err;
    }
  }

  try {
    return parseYaml(trimmed) as OpenApiDocument;
  } catch (err) {
    if (jsonError) {
      const jsonMessage = jsonError instanceof Error ? jsonError.message : String(jsonError);
      const yamlMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse OpenAPI spec as JSON or YAML. JSON error: ${jsonMessage}. YAML error: ${yamlMessage}`);
    }
    throw err;
  }
}

function looksLikeJson(input: string): boolean {
  const first = input[0];
  return first === '{' || first === '[';
}

function validateOpenApiDocument(doc: OpenApiDocument): ImportOpenApiValidationResult {
  const errors: string[] = [];

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['OpenAPI document must be an object'] };
  }

  const version = doc.openapi ?? doc.swagger;
  if (typeof version !== 'string' || version.trim().length === 0) {
    errors.push('Missing openapi/swagger version');
  }

  const paths = doc.paths;
  if (!paths || typeof paths !== 'object') {
    errors.push('Missing paths object');
  }

  return { valid: errors.length === 0, errors };
}

function isHttpMethodKey(k: string): boolean {
  return ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(k.toLowerCase());
}

function buildFallbackOperationId(method: HttpMethod, path: string): string {
  const m = method.toLowerCase();
  const p = path.replace(/[{}]/g, '').replace(/\//g, '_').replace(/[^a-zA-Z0-9_\-]/g, '_');
  return `${m}_${p}`;
}

function normalizeToolName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

function ensureUniqueToolName(base: string, counts: Map<string, number>): string {
  const cur = counts.get(base) ?? 0;
  if (cur === 0) {
    counts.set(base, 1);
    return base;
  }

  const next = cur + 1;
  counts.set(base, next);
  return `${base}__${next}`;
}

function convertOasPathToMustache(path: string): string {
  return path.replace(/\{([^}]+)\}/g, (_m: string, name: string) => `{{${name}}}`);
}

function deref<T>(doc: OpenApiDocument, obj: T | RefObject | undefined): T | undefined {
  if (!obj || typeof obj !== 'object') return obj;

  const ref = (obj as RefObject).$ref;
  if (!ref || typeof ref !== 'string') {
    return obj as T;
  }

  if (!ref.startsWith('#/')) return obj as T;

  const parts = ref
    .slice(2)
    .split('/')
    .map((p: string) => decodeURIComponent(p));

  let cur: unknown = doc;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return obj as T;
    cur = (cur as Record<string, unknown>)[p];
  }

  return (cur as T) ?? (obj as T);
}

function buildParamsObjectSchema(doc: OpenApiDocument, params: ParameterObject[]): Schema | undefined {
  if (!params || params.length === 0) return undefined;

  const properties: { [key: string]: Schema } = {};
  const required: string[] = [];

  for (const p0 of params) {
    const p = deref<ParameterObject>(doc, p0);
    if (!p?.name) continue;

    const sourceSchema: SchemaObject | RefObject = p.schema ?? { type: 'string' };
    const s = openApiSchemaToSchema(doc, sourceSchema);
    if (p.description) s.description = p.description;

    properties[p.name] = s;
    if (p.required) required.push(p.name);
  }

  const schema: Schema = {
    type: SchemaType.OBJECT,
    properties,
  };
  if (required.length > 0) {
    schema.required = required;
  }
  return schema;
}

function buildRequestBody(
  doc: OpenApiDocument,
  requestBody?: RequestBodyObject | RefObject,
): { bodySchema?: Schema; bodyRequired: boolean; bodyDefinition?: { mode: RequestBodyMode; contentType?: string; fields?: RequestBodyField[] } } {
  if (!requestBody) return { bodyRequired: false };

  const rb = deref<RequestBodyObject>(doc, requestBody);
  if (!rb) return { bodyRequired: false };

  const required = rb.required === true;
  const content = rb.content ?? {};

  const json = content['application/json'] ?? content['application/*+json'];
  if (json?.schema) {
    const bodySchema = openApiSchemaToSchema(doc, json.schema);
    return {
      bodySchema,
      bodyRequired: required,
      bodyDefinition: { mode: 'raw', contentType: 'application/json' },
    };
  }

  const multipart = content['multipart/form-data'];
  if (multipart?.schema) {
    const schema = deref<SchemaObject>(doc, multipart.schema);
    if (!schema) return { bodyRequired: required };

    const bodySchema = openApiSchemaToSchema(doc, schema);
    const fields: RequestBodyField[] = [];

    if (schema.type === 'object' && schema.properties) {
      for (const [k, v] of Object.entries(schema.properties)) {
        const s = openApiSchemaToSchema(doc, v);
        const isFile = s.type === SchemaType.STRING && (s.format === 'binary' || s.format === 'base64');
        fields.push({ key: k, type: isFile ? 'file' : 'text', enabled: true });
      }
    }

    return {
      bodySchema,
      bodyRequired: required,
      bodyDefinition: { mode: 'multipart', contentType: 'multipart/form-data', fields },
    };
  }

  const urlencoded = content['application/x-www-form-urlencoded'];
  if (urlencoded?.schema) {
    const schema = deref<SchemaObject>(doc, urlencoded.schema);
    if (!schema) return { bodyRequired: required };

    const bodySchema = openApiSchemaToSchema(doc, schema);
    const fields: RequestBodyField[] = [];

    if (schema.type === 'object' && schema.properties) {
      for (const k of Object.keys(schema.properties)) {
        fields.push({ key: k, type: 'text', enabled: true });
      }
    }

    return {
      bodySchema,
      bodyRequired: required,
      bodyDefinition: { mode: 'urlencoded', contentType: 'application/x-www-form-urlencoded', fields },
    };
  }

  return { bodyRequired: required };
}

function buildResponses(
  doc: OpenApiDocument,
  responses: Record<string, ResponseObject | RefObject> | undefined,
): ResponseDefinition[] | undefined {
  if (!responses || typeof responses !== 'object') return undefined;

  const out: ResponseDefinition[] = [];
  const keys = Object.keys(responses).sort();

  for (const status of keys) {
    const resp = deref<ResponseObject>(doc, responses[status]);
    if (!resp || typeof resp !== 'object') continue;

    const description = typeof resp.description === 'string' ? resp.description : undefined;
    const content = resp.content ?? {};

    let contentType: string | undefined;
    let schema: Schema | undefined;

    const contentTypes = Object.keys(content);
    const firstContentType = contentTypes.length > 0 ? contentTypes[0] : undefined;
    const preferred: MediaTypeObject | undefined =
      content['application/json'] ?? content['application/*+json'] ?? (firstContentType ? content[firstContentType] : undefined);

    if (preferred && typeof preferred === 'object') {
      const selectedType =
        content['application/json'] ? 'application/json' : content['application/*+json'] ? 'application/*+json' : firstContentType;
      contentType = selectedType ?? undefined;
      if (preferred.schema) {
        schema = openApiSchemaToSchema(doc, preferred.schema);
      }
    }

    const response: ResponseDefinition = {
      status,
    };
    if (description !== undefined) response.description = description;
    if (contentType !== undefined) response.contentType = contentType;
    if (schema !== undefined) response.schema = schema;
    out.push(response);
  }

  return out.length > 0 ? out : undefined;
}

function openApiSchemaToSchema(doc: OpenApiDocument, schema0: SchemaObject | RefObject): Schema {
  const schema = deref<SchemaObject>(doc, schema0);

  if (!schema || typeof schema !== 'object') {
    return { type: SchemaType.STRING };
  }

  if (Array.isArray(schema.type)) {
    const nonNull = schema.type.find((t: string) => t !== 'null');
    const out = openApiSchemaToSchema(doc, { ...schema, type: nonNull ?? 'string' });
    if (schema.type.includes('null')) out.nullable = true;
    return out;
  }

  if (schema.allOf) {
    return {
      type: SchemaType.OBJECT,
      allOf: schema.allOf.map((s: SchemaObject | RefObject) => openApiSchemaToSchema(doc, s)),
    };
  }

  if (schema.oneOf) {
    return {
      type: SchemaType.OBJECT,
      oneOf: schema.oneOf.map((s: SchemaObject | RefObject) => openApiSchemaToSchema(doc, s)),
    };
  }

  if (schema.anyOf) {
    return {
      type: SchemaType.OBJECT,
      anyOf: schema.anyOf.map((s: SchemaObject | RefObject) => openApiSchemaToSchema(doc, s)),
    };
  }

  const out: Schema = {
    type: mapOasType(schema.type, schema),
  };
  if (schema.title !== undefined) out.title = schema.title;
  if (schema.description !== undefined) out.description = schema.description;
  if (schema.nullable !== undefined) out.nullable = schema.nullable;
  if (schema.enum !== undefined) out.enum = schema.enum;
  if (schema.format !== undefined) out.format = schema.format;

  if (out.type === SchemaType.ARRAY) {
    if (schema.minItems !== undefined) out.minItems = String(schema.minItems);
    if (schema.maxItems !== undefined) out.maxItems = String(schema.maxItems);
    if (schema.items) out.items = openApiSchemaToSchema(doc, schema.items);
  }

  if (out.type === SchemaType.OBJECT) {
    if (schema.minProperties !== undefined) out.minProperties = String(schema.minProperties);
    if (schema.maxProperties !== undefined) out.maxProperties = String(schema.maxProperties);

    if (schema.properties) {
      out.properties = {};
      for (const [k, v] of Object.entries(schema.properties)) {
        out.properties[k] = openApiSchemaToSchema(doc, v);
      }
    }

    if (Array.isArray(schema.required)) out.required = schema.required;

    if (schema.additionalProperties !== undefined) {
      if (typeof schema.additionalProperties === 'boolean') {
        out.additionalProperties = schema.additionalProperties;
      } else {
        out.additionalProperties = openApiSchemaToSchema(doc, schema.additionalProperties);
      }
    }
  }

  if (out.type === SchemaType.STRING) {
    if (schema.minLength !== undefined) out.minLength = String(schema.minLength);
    if (schema.maxLength !== undefined) out.maxLength = String(schema.maxLength);
    if (schema.pattern !== undefined) out.pattern = schema.pattern;
  }

  if (out.type === SchemaType.NUMBER || out.type === SchemaType.INTEGER) {
    if (schema.minimum !== undefined) out.minimum = schema.minimum;
    if (schema.maximum !== undefined) out.maximum = schema.maximum;
  }

  if (schema.example !== undefined) out.example = schema.example;
  if (schema.default !== undefined) out.default = schema.default;
  if (schema.not) out.not = openApiSchemaToSchema(doc, schema.not);

  return out;
}

function mapOasType(oasType: unknown, schema: SchemaObject): SchemaType {
  if (!oasType) {
    if (schema.properties || schema.additionalProperties) return SchemaType.OBJECT;
    if (schema.items) return SchemaType.ARRAY;
    return SchemaType.STRING;
  }

  switch (oasType) {
    case 'string':
      return SchemaType.STRING;
    case 'number':
      return SchemaType.NUMBER;
    case 'integer':
      return SchemaType.INTEGER;
    case 'boolean':
      return SchemaType.BOOLEAN;
    case 'array':
      return SchemaType.ARRAY;
    case 'object':
      return SchemaType.OBJECT;
    default:
      return SchemaType.STRING;
  }
}

function createRequestParamItem(key: string, description?: string): RequestParamItem {
  const item: RequestParamItem = {
    key,
    value: '',
    enabled: true,
  };
  if (description !== undefined) {
    item.description = description;
  }
  return item;
}
