/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  AddMemberParams,
  ApiResponseDto,
  ListMembersParams,
  RemoveMemberParams,
  UpdateMemberParams,
  WorkspaceInviteResponseDto,
  WorkspaceMemberListResponseDto,
  WorkspaceMemberResponseDto,
} from '../types';

export class WorkspaceMembersService {
  constructor(private readonly client: HttpClient) {}

  async listMembers(params: ListMembersParams): Promise<ApiResponseDto<WorkspaceMemberListResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceMemberListResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/members`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async addMember(params: AddMemberParams): Promise<ApiResponseDto<WorkspaceInviteResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceInviteResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/members`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async removeMember(params: RemoveMemberParams): Promise<ApiResponseDto<WorkspaceMemberResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceMemberResponseDto>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/members/${encodeURIComponent(String(params.memberId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateMember(params: UpdateMemberParams): Promise<ApiResponseDto<WorkspaceMemberResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceMemberResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/members/${encodeURIComponent(String(params.memberId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
