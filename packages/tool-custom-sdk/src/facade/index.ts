import { AxiosExecutor } from '../executor/axios-executor';
import { generateGoogleFunctionDeclaration, GoogleFunctionDeclaration } from '../generators/google-tool-generator';
import { generateOpenAiToolDefinition, OpenAiToolDefinition } from '../generators/openai-tool-generator';
import { OpenApiImporter } from '../importers/openapi-importer';
import { PostmanImporter } from '../importers/postman-importer';
import { AuthProfile, AuthConfig } from '../types/auth';
import { ExecutionContext, ExecutionPolicy, ExecutionResult, ToolSchemaTarget } from '../types/execution';
import { ApiFolder, ApiOperation, Environment } from '../types/ir';

export interface NormalizeImportedOperationsInput {
  sourceType: 'openapi' | 'postman';
  source: string | Record<string, unknown>;
  options: {
    collectionId: string;
    versionId: string;
    defaultBaseUrlVar?: string;
    tagAsFolder?: boolean;
    defaultFolderParentId?: string;
  };
}

export interface NormalizeImportedOperationsResult {
  operations: ApiOperation[];
  folders?: ApiFolder[];
  authProfiles?: AuthProfile[];
  environments?: Environment[];
}

export interface ToolArgumentsEnvelope {
  path?: Record<string, string | number | boolean>;
  query?: Record<string, string | number | boolean>;
  headers?: Record<string, string | number | boolean>;
  cookies?: Record<string, string | number | boolean>;
  body?: unknown;
  [key: string]: unknown;
}

export function normalizeImportedOperations(input: NormalizeImportedOperationsInput): NormalizeImportedOperationsResult {
  if (input.sourceType === 'openapi') {
    const importer = new OpenApiImporter();
    const options: NormalizeImportedOperationsInput['options'] = {
      collectionId: input.options.collectionId,
      versionId: input.options.versionId,
    };
    if (input.options.defaultBaseUrlVar !== undefined) {
      options.defaultBaseUrlVar = input.options.defaultBaseUrlVar;
    }
    if (input.options.tagAsFolder !== undefined) {
      options.tagAsFolder = input.options.tagAsFolder;
    }

    const out = importer.import({
      spec: input.source,
      options,
    });

    return { operations: out.operations };
  }

  const importer = new PostmanImporter();
  const postmanCollection = typeof input.source === 'string' ? (JSON.parse(input.source) as Record<string, unknown>) : input.source;
  const options: NormalizeImportedOperationsInput['options'] = {
    collectionId: input.options.collectionId,
    versionId: input.options.versionId,
  };
  if (input.options.defaultFolderParentId !== undefined) {
    options.defaultFolderParentId = input.options.defaultFolderParentId;
  }
  const out = importer.import({
    collection: postmanCollection,
    options,
  });

  return {
    operations: out.operations,
    folders: out.folders,
    authProfiles: out.authProfiles,
    environments: out.environments,
  };
}

export function buildToolDefinitions(
  operations: ApiOperation[],
  target: ToolSchemaTarget,
): Array<OpenAiToolDefinition | GoogleFunctionDeclaration> {
  if (target === 'openai') return operations.map((op: ApiOperation) => generateOpenAiToolDefinition(op));
  if (target === 'google') return operations.map((op: ApiOperation) => generateGoogleFunctionDeclaration(op));
  throw new Error(`Unsupported target: ${target}`);
}

export async function executeFromOperation(input: {
  operation: ApiOperation;
  args?: ToolArgumentsEnvelope;
  context: ExecutionContext;
  envVars?: Record<string, string | undefined>;
  auth?: AuthConfig;
  policy?: ExecutionPolicy;
  executorOptions?: ConstructorParameters<typeof AxiosExecutor>[0];
}): Promise<ExecutionResult> {
  const executor = new AxiosExecutor(input.executorOptions);
  const executeInput: {
    request: ApiOperation['requestDefinition'];
    args?: ToolArgumentsEnvelope;
    envVars: Record<string, string | undefined>;
    auth?: AuthConfig;
    context: ExecutionContext;
    policy?: ExecutionPolicy;
  } = {
    request: input.operation.requestDefinition,
    envVars: input.envVars ?? {},
    context: input.context,
  };
  if (input.args !== undefined) {
    executeInput.args = input.args;
  }
  if (input.auth !== undefined) {
    executeInput.auth = input.auth;
  }
  if (input.policy !== undefined) {
    executeInput.policy = input.policy;
  }

  return executor.execute(executeInput);
}
