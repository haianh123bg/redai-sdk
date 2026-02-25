/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  AddBaseMemberParams,
  ApiResponseDto,
  BaseMemberListResponseDto,
  BaseMemberResponseDto,
  ListBaseMembersParams,
  RemoveBaseMemberParams,
  UpdateBaseMemberParams,
} from '../types';

export class BaseMembersService {
  constructor(private readonly client: HttpClient) {}

  async listBaseMembers(params: ListBaseMembersParams): Promise<ApiResponseDto<BaseMemberListResponseDto>> {
    return this.client.request<ApiResponseDto<BaseMemberListResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}/members`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async addBaseMember(params: AddBaseMemberParams): Promise<ApiResponseDto<BaseMemberResponseDto>> {
    return this.client.request<ApiResponseDto<BaseMemberResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}/members`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async removeBaseMember(params: RemoveBaseMemberParams): Promise<ApiResponseDto<BaseMemberResponseDto>> {
    return this.client.request<ApiResponseDto<BaseMemberResponseDto>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}/members/${encodeURIComponent(String(params.baseMemberId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateBaseMember(params: UpdateBaseMemberParams): Promise<ApiResponseDto<BaseMemberResponseDto>> {
    return this.client.request<ApiResponseDto<BaseMemberResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}/members/${encodeURIComponent(String(params.baseMemberId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
