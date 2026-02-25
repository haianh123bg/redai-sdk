export type WorkflowRunStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";

export interface WorkflowRunInput {
  workflowKey: string;
  payload?: Record<string, unknown>;
  requestedBy?: string;
}

export interface WorkflowRunResult {
  runId: string;
  status: WorkflowRunStatus;
  startedAt?: string;
  finishedAt?: string;
}

export function createWorkflowRunInput(
  workflowKey: string,
  payload?: Record<string, unknown>,
  requestedBy?: string
): WorkflowRunInput {
  return {
    workflowKey,
    payload,
    requestedBy
  };
}
