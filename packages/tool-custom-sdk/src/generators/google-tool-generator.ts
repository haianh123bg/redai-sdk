import { ApiOperation } from '../types/ir';
import { JsonSchema, schemaToJsonSchema } from '../utils/schema-to-jsonschema';

export interface GoogleFunctionDeclaration {
  name: string;
  description?: string;
  parameters?: JsonSchema;
}

export function generateGoogleFunctionDeclaration(operation: ApiOperation): GoogleFunctionDeclaration {
  const declaration: GoogleFunctionDeclaration = {
    name: operation.toolName,
    parameters: schemaToJsonSchema(operation.toolInputSchema),
  };
  if (operation.description !== undefined) {
    declaration.description = operation.description;
  }

  return declaration;
}
