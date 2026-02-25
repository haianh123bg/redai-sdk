import { AuthConfig, AuthMode } from './auth';
import { Schema } from './schema';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiCollection {
  id: string;
  name: string;
}

export interface ApiVersion {
  id: string;
  collectionId: string;
  version: string;
  isDefault?: boolean;
  status?: 'active' | 'deprecated';
  releasedAt?: string;
}

export interface ApiFolder {
  id: string;
  collectionId: string;
  versionId: string;
  parentId?: string;
  name: string;
  order?: number;

  auth?: AuthConfig;
  authRefId?: string;
  authMode?: AuthMode;
}

export interface RequestParamItem {
  key: string;
  value?: string;
  enabled?: boolean;
  description?: string;
}

export interface FileUrlRef {
  url: string;
  filename?: string;
}

export type RequestBodyMode = 'none' | 'raw' | 'urlencoded' | 'form-data' | 'multipart' | 'binary';

export interface RequestBodyField {
  key: string;
  type?: 'text' | 'file';
  value?: string | FileUrlRef;
  enabled?: boolean;
}

export interface RequestBodyDefinition {
  mode: RequestBodyMode;
  contentType?: string;
  rawText?: string;
  fields?: RequestBodyField[];
  binary?: FileUrlRef;
}

export interface RequestDefinition {
  id: string;
  operationId: string;
  folderId?: string;

  baseUrl?: string;
  urlTemplate: string;
  method: HttpMethod;

  pathParams?: RequestParamItem[];
  queryParams?: RequestParamItem[];
  headers?: RequestParamItem[];
  cookies?: RequestParamItem[];

  auth?: AuthConfig;
  authRefId?: string;
  authMode?: AuthMode;

  body?: RequestBodyDefinition;

  timeoutMs?: number;
  followRedirects?: boolean;
  maxRedirects?: number;
}

export interface ResponseDefinition {
  status: string;
  description?: string;
  contentType?: string;
  schema?: Schema;
}

export interface ApiOperation {
  id: string;
  collectionId: string;
  versionId: string;
  folderId?: string;

  toolName: string;
  method: HttpMethod;
  path: string;

  name?: string;
  description?: string;
  tags?: string[];

  toolInputSchema: Schema;
  requestDefinition: RequestDefinition;
  responses?: ResponseDefinition[];
}

export interface EnvironmentVariable {
  key: string;
  value?: string;
  enabled?: boolean;
  isSecret?: boolean;
}

export interface Environment {
  id: string;
  collectionId: string;
  name: string;
  variables: EnvironmentVariable[];
}

export interface ToolCallEnvelope {
  toolName: string;
  arguments: unknown;
  raw?: unknown;
}
