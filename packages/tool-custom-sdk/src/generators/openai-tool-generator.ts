import { ApiOperation } from '../types/ir';
import { JsonSchema, schemaToJsonSchema } from '../utils/schema-to-jsonschema';

export interface OpenAiToolDefinition {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters: JsonSchema;
  };
}

export function generateOpenAiToolDefinition(operation: ApiOperation): OpenAiToolDefinition {
  const fn: OpenAiToolDefinition['function'] = {
    name: operation.toolName,
    parameters: schemaToJsonSchema(operation.toolInputSchema),
  };
  if (operation.description !== undefined) {
    fn.description = operation.description;
  }

  return {
    type: 'function',
    function: fn,
  };
}
