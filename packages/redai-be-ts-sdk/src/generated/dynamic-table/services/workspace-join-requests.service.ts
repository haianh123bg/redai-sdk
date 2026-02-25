/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  ApproveRequestParams,
  ListRequestsParams,
  PagedResponse,
  RejectRequestParams,
  WorkspaceJoinRequestResponseDto,
  WorkspaceMemberResponseDto,
} from '../types';

export class WorkspaceJoinRequestsService {
  constructor(private readonly client: HttpClient) {}

  async listRequests(params: ListRequestsParams): Promise<ApiResponseDto<PagedResponse<WorkspaceJoinRequestResponseDto>>> {
    return this.client.request<ApiResponseDto<PagedResponse<WorkspaceJoinRequestResponseDto>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/join-requests`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async approveRequest(params: ApproveRequestParams): Promise<ApiResponseDto<WorkspaceMemberResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceMemberResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/join-requests/${encodeURIComponent(String(params.requestId))}/approve`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async rejectRequest(params: RejectRequestParams): Promise<ApiResponseDto<WorkspaceJoinRequestResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceJoinRequestResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/join-requests/${encodeURIComponent(String(params.requestId))}/reject`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
