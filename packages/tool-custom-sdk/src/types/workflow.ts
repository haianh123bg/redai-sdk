export type WorkflowPurpose = 'create' | 'refresh';

export interface Workflow {
  id: string;
  collectionId: string;
  name: string;
  description?: string;
  enabled?: boolean;
}

export interface AuthWorkflowLink {
  id: string;
  authProfileId: string;
  workflowId: string;
  purpose: WorkflowPurpose;
  enabled?: boolean;
}
