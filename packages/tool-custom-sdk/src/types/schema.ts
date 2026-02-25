export enum SchemaType {
  STRING = 'string',
  NUMBER = 'number',
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  NULL = 'null',
  FUNCTION = 'function',
}

export type SchemaValue = unknown;

export interface Schema {
  type: SchemaType;

  title?: string;
  description?: string;
  nullable?: boolean;

  enum?: SchemaValue[];

  maxItems?: string;
  minItems?: string;
  items?: Schema;

  properties?: { [key: string]: Schema };
  required?: string[];
  minProperties?: string;
  maxProperties?: string;
  additionalProperties?: boolean | Schema;
  propertyOrdering?: string[];

  minLength?: string;
  maxLength?: string;
  pattern?: string;
  format?: string;

  minimum?: number;
  maximum?: number;

  example?: SchemaValue;
  default?: SchemaValue;

  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  not?: Schema;
}
