/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateWorkspaceParams,
  DeleteWorkspaceParams,
  GetWorkspaceBySlugParams,
  GetWorkspaceParams,
  ListWorkspacesParams,
  PagedResponse,
  UpdateWorkspaceParams,
  WorkspaceResponseDto,
} from '../types';

export class WorkspacesService {
  constructor(private readonly client: HttpClient) {}

  async listWorkspaces(params?: ListWorkspacesParams): Promise<ApiResponseDto<PagedResponse<WorkspaceResponseDto>>> {
    return this.client.request<ApiResponseDto<PagedResponse<WorkspaceResponseDto>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async createWorkspace(params: CreateWorkspaceParams): Promise<ApiResponseDto<WorkspaceResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspaces`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async deleteWorkspace(params: DeleteWorkspaceParams): Promise<ApiResponseDto<WorkspaceResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceResponseDto>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getWorkspace(params: GetWorkspaceParams): Promise<ApiResponseDto<WorkspaceResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateWorkspace(params: UpdateWorkspaceParams): Promise<ApiResponseDto<WorkspaceResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async getWorkspaceBySlug(params: GetWorkspaceBySlugParams): Promise<ApiResponseDto<WorkspaceResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces/slug/${encodeURIComponent(String(params.slug))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
