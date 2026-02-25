export type ToolSchemaTarget = 'openai' | 'google';

export interface ExecutionPolicy {
  allowedHosts?: string[];
  allowedAuthProfileIds?: string[];
  allowedEnvironmentIds?: string[];
  allowedFileHosts?: string[];
  maxResponseBytes?: number;
}

export type ExecutionMode = 'agent' | 'direct';

export interface ExecutionActor {
  userId?: string;
  agentId?: string;
}

export interface ExecutionContext {
  mode: ExecutionMode;
  environmentId?: string;
  authProfileId?: string;
  actor?: ExecutionActor;
  policy?: ExecutionPolicy;
  traceId?: string;
  correlationId?: string;
}

export interface ExecutionResult {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  durationMs: number;
}
