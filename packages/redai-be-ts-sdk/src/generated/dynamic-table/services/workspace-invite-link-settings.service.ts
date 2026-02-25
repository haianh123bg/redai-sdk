/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  DeleteSettingsParams,
  GetSettingsParams,
  UpsertSettingsParams,
  WorkspaceInviteLinkSettingsResponseDto,
} from '../types';

export class WorkspaceInviteLinkSettingsService {
  constructor(private readonly client: HttpClient) {}

  async deleteSettings(params: DeleteSettingsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/invite-link-settings`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getSettings(params: GetSettingsParams): Promise<ApiResponseDto<WorkspaceInviteLinkSettingsResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceInviteLinkSettingsResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/invite-link-settings`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async upsertSettings(params: UpsertSettingsParams): Promise<ApiResponseDto<WorkspaceInviteLinkSettingsResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceInviteLinkSettingsResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/invite-link-settings`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
