import * as crypto from 'crypto';
import { getRefTypeName, normalizeNullable, primitiveForType, sanitizePropertyName, sanitizeTypeName, SchemaObject, OperationObject } from './shared';

export const INLINE_TYPES: string[] = [];
export const INLINE_TYPE_CACHE = new Map<string, string>();

const toLiteral = (v: string | number | boolean | null): string => {
  if (v === null) return 'null';
  if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
  return String(v);
};

export const schemaToTs = (schema: SchemaObject | undefined, ctxName: string): string => {
  if (!schema) return 'unknown';
  if (schema.$ref) return getRefTypeName(schema.$ref);
  if (schema.oneOf?.length) return normalizeNullable(schema.oneOf.map((s, i) => schemaToTs(s, `${ctxName}OneOf${i}`)).join(' | '), schema.nullable);
  if (schema.anyOf?.length) return normalizeNullable(schema.anyOf.map((s, i) => schemaToTs(s, `${ctxName}AnyOf${i}`)).join(' | '), schema.nullable);
  if (schema.allOf?.length) return normalizeNullable(schema.allOf.map((s, i) => schemaToTs(s, `${ctxName}AllOf${i}`)).join(' & '), schema.nullable);
  if (schema.enum?.length) return normalizeNullable(schema.enum.map(toLiteral).join(' | '), schema.nullable);
  if (schema.type === 'array') return normalizeNullable(`(${schemaToTs(schema.items, `${ctxName}Item`)})[]`, schema.nullable);

  if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
    const req = new Set(schema.required ?? []);
    const props = Object.entries(schema.properties ?? {}).map(([k, v]) => `  ${sanitizePropertyName(k)}${req.has(k) ? '' : '?'}: ${schemaToTs(v, `${ctxName}${sanitizeTypeName(k)}`)};`);
    const add = schema.additionalProperties === true
      ? '\n  [key: string]: unknown;'
      : schema.additionalProperties && typeof schema.additionalProperties === 'object'
        ? `\n  [key: string]: ${schemaToTs(schema.additionalProperties, `${ctxName}Additional`)};`
        : '';
    return normalizeNullable(`\n{\n${props.join('\n')}${add}\n}`, schema.nullable);
  }

  return normalizeNullable(primitiveForType(schema.type, schema.format), schema.nullable);
};

export const schemaToNamedType = (schema: SchemaObject | undefined, preferredName: string): string => {
  if (!schema) return 'unknown';
  if (schema.$ref) return getRefTypeName(schema.$ref);
  const hash = crypto.createHash('sha1').update(JSON.stringify(schema)).digest('hex').slice(0, 10);
  const cached = INLINE_TYPE_CACHE.get(hash);
  if (cached) return cached;

  const typeName = sanitizeTypeName(preferredName);
  const finalName = INLINE_TYPES.some((l) => l.includes(`export type ${typeName} =`)) ? `${typeName}${hash}` : typeName;
  INLINE_TYPES.push(`export type ${finalName} = ${schemaToTs(schema, finalName)};`);
  INLINE_TYPE_CACHE.set(hash, finalName);
  return finalName;
};

export const pickMediaSchema = (content: Record<string, { schema?: SchemaObject }> | undefined): SchemaObject | undefined => {
  if (!content) return undefined;
  return content['application/json']?.schema || content['application/*+json']?.schema || Object.values(content)[0]?.schema;
};

export const getOpenApiResponseType = (operation: OperationObject, operationName: string): string => {
  const responses = operation.responses ?? {};
  const ok = ['200', '201', '202', '203', '204'].find((s) => responses[s]);
  if (!ok) return 'unknown';
  if (ok === '204') return 'void';
  const schema = pickMediaSchema(responses[ok]?.content);
  if (!schema) return 'unknown';
  return schemaToNamedType(schema, `${operationName}Response`);
};

export const collectRefsFromSchema = (schema: SchemaObject | undefined, refs: Set<string>): void => {
  if (!schema) return;
  if (schema.$ref) {
    refs.add(getRefTypeName(schema.$ref));
    return;
  }
  for (const s of schema.oneOf ?? []) collectRefsFromSchema(s, refs);
  for (const s of schema.anyOf ?? []) collectRefsFromSchema(s, refs);
  for (const s of schema.allOf ?? []) collectRefsFromSchema(s, refs);
  if (schema.items) collectRefsFromSchema(schema.items, refs);
  for (const p of Object.values(schema.properties ?? {})) collectRefsFromSchema(p, refs);
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') collectRefsFromSchema(schema.additionalProperties, refs);
};
