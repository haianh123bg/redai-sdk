/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  AcceptInviteParams,
  ApiResponseDto,
  WorkspaceMemberResponseDto,
} from '../types';

export class WorkspaceInvitesService {
  constructor(private readonly client: HttpClient) {}

  async acceptInvite(params: AcceptInviteParams): Promise<ApiResponseDto<WorkspaceMemberResponseDto>> {
    return this.client.request<ApiResponseDto<WorkspaceMemberResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspace-invites/accept`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
