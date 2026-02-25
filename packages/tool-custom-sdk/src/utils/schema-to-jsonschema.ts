import { Schema, SchemaType } from '../types/schema';

export type JsonSchemaValue = string | number | boolean | null | JsonSchema | JsonSchemaValue[];
export interface JsonSchema {
  [key: string]: JsonSchemaValue;
}

export function schemaToJsonSchema(schema: Schema): JsonSchema {
  const base = schemaToJsonSchemaInner(schema);

  if (schema.nullable) {
    const baseType = base.type;
    if (typeof baseType === 'string') {
      base.type = [baseType, 'null'];
    } else if (Array.isArray(baseType)) {
      if (!baseType.includes('null')) baseType.push('null');
      base.type = baseType;
    } else {
      const existingAnyOf = Array.isArray(base.anyOf) ? base.anyOf : [];
      base.anyOf = [...existingAnyOf, { type: 'null' }];
    }
  }

  return base;
}

function schemaToJsonSchemaInner(schema: Schema): JsonSchema {
  const out: JsonSchema = {};

  out.type = mapType(schema.type);

  if (schema.title !== undefined) out.title = schema.title;
  if (schema.description !== undefined) out.description = schema.description;

  if (schema.enum) out.enum = schema.enum as JsonSchemaValue[];

  if (schema.minLength !== undefined) out.minLength = parseIntSafe(schema.minLength);
  if (schema.maxLength !== undefined) out.maxLength = parseIntSafe(schema.maxLength);
  if (schema.pattern !== undefined) out.pattern = schema.pattern;
  if (schema.format !== undefined) out.format = schema.format;

  if (schema.minimum !== undefined) out.minimum = schema.minimum;
  if (schema.maximum !== undefined) out.maximum = schema.maximum;

  if (schema.example !== undefined) out.example = schema.example as JsonSchemaValue;
  if (schema.default !== undefined) out.default = schema.default as JsonSchemaValue;

  if (schema.type === SchemaType.ARRAY) {
    if (schema.items) out.items = schemaToJsonSchema(schema.items);
    if (schema.minItems !== undefined) out.minItems = parseIntSafe(schema.minItems);
    if (schema.maxItems !== undefined) out.maxItems = parseIntSafe(schema.maxItems);
  }

  if (schema.type === SchemaType.OBJECT) {
    if (schema.properties) {
      const properties: Record<string, JsonSchema> = {};
      for (const [key, value] of Object.entries(schema.properties)) {
        properties[key] = schemaToJsonSchema(value);
      }
      out.properties = properties;
    }

    if (schema.required) out.required = schema.required;
    if (schema.minProperties !== undefined) out.minProperties = parseIntSafe(schema.minProperties);
    if (schema.maxProperties !== undefined) out.maxProperties = parseIntSafe(schema.maxProperties);

    if (schema.additionalProperties !== undefined) {
      if (typeof schema.additionalProperties === 'boolean') {
        out.additionalProperties = schema.additionalProperties;
      } else {
        out.additionalProperties = schemaToJsonSchema(schema.additionalProperties);
      }
    }
  }

  if (schema.allOf) out.allOf = schema.allOf.map((item: Schema) => schemaToJsonSchema(item));
  if (schema.oneOf) out.oneOf = schema.oneOf.map((item: Schema) => schemaToJsonSchema(item));
  if (schema.anyOf) out.anyOf = schema.anyOf.map((item: Schema) => schemaToJsonSchema(item));
  if (schema.not) out.not = schemaToJsonSchema(schema.not);

  return out;
}

function mapType(type: SchemaType): string {
  switch (type) {
    case SchemaType.STRING:
      return 'string';
    case SchemaType.NUMBER:
      return 'number';
    case SchemaType.INTEGER:
      return 'integer';
    case SchemaType.BOOLEAN:
      return 'boolean';
    case SchemaType.ARRAY:
      return 'array';
    case SchemaType.OBJECT:
      return 'object';
    case SchemaType.NULL:
      return 'null';
    case SchemaType.FUNCTION:
      return 'object';
  }
}

function parseIntSafe(value: string): number {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}
