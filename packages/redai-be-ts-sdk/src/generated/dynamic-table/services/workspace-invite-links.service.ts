/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateInviteLinkParams,
  GetInviteLinkParams,
  GetOrCreateInviteLinkParams,
  RequestJoinParams,
  WorkspaceInviteLinkResponseDto,
  WorkspaceJoinRequestResponseDto,
} from '../types';

export class WorkspaceInviteLinksService {
  constructor(private readonly client: HttpClient) {}

  async requestJoin(params: RequestJoinParams): Promise<ApiResponseDto<WorkspaceJoinRequestResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceJoinRequestResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspace-invite-links/${encodeURIComponent(String(params.linkId))}/request`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async getInviteLink(params: GetInviteLinkParams): Promise<ApiResponseDto<WorkspaceInviteLinkResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceInviteLinkResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/invite-links`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async createInviteLink(params: CreateInviteLinkParams): Promise<ApiResponseDto<WorkspaceInviteLinkResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceInviteLinkResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/invite-links`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async getOrCreateInviteLink(params: GetOrCreateInviteLinkParams): Promise<ApiResponseDto<WorkspaceInviteLinkResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceInviteLinkResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/invite-links/get-or-create`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
