/**
 * Schema interface cho tool input/output theo chuẩn OpenAPI/JSON Schema
 * Sử dụng cho AI tool calling và validation
 */

// ===== Enums =====
export enum SchemaType {
  STRING = 'string',
  NUMBER = 'number',
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  NULL = 'null',
  /** Dùng cho callback/function props trong React component */
  FUNCTION = 'function',
}

// ===== Value alias =====
// Theo spec: example/default là "value (Value format)" → dùng unknown
export type SchemaValue = unknown;

// ===== Schema chính =====
export interface Schema {
  /** Required. Data type. */
  type: SchemaType;

  /** Optional */
  title?: string;
  description?: string;
  nullable?: boolean;

  /** STRING with enum format */
  enum?: SchemaValue[];

  /** ARRAY fields (int64 → string trong spec) */
  maxItems?: string; // int64 as string
  minItems?: string; // int64 as string
  items?: Schema; // element schema

  /** OBJECT fields */
  properties?: { [key: string]: Schema };
  required?: string[];
  minProperties?: string; // int64 as string
  maxProperties?: string; // int64 as string
  additionalProperties?: boolean | Schema;
  propertyOrdering?: string[]; // không chuẩn OAS, dùng để sắp xếp hiển thị

  /** STRING constraints */
  minLength?: string; // int64 as string
  maxLength?: string; // int64 as string
  pattern?: string;
  format?: string;

  /** NUMBER/INTEGER constraints */
  minimum?: number;
  maximum?: number;

  /** Examples & defaults (không ảnh hưởng validation – chỉ doc) */
  example?: SchemaValue;
  default?: SchemaValue;

  /** Compositional */
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  not?: Schema;
}
