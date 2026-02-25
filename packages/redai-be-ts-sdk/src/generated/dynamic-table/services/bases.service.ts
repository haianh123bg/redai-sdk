/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  BaseResponseDto,
  CreateBaseParams,
  DeleteBaseParams,
  GetBaseParams,
  ListBasesParams,
  PagedResponse,
  UpdateBaseParams,
} from '../types';

export class BasesService {
  constructor(private readonly client: HttpClient) {}

  async deleteBase(params: DeleteBaseParams): Promise<ApiResponseDto<BaseResponseDto>> {
    return this.client.request<ApiResponseDto<BaseResponseDto>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getBase(params: GetBaseParams): Promise<ApiResponseDto<BaseResponseDto>> {
    return this.client.request<ApiResponseDto<BaseResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateBase(params: UpdateBaseParams): Promise<ApiResponseDto<BaseResponseDto>> {
    return this.client.request<ApiResponseDto<BaseResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listBases(params: ListBasesParams): Promise<ApiResponseDto<PagedResponse<BaseResponseDto>>> {
    return this.client.request<ApiResponseDto<PagedResponse<BaseResponseDto>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/bases`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async createBase(params: CreateBaseParams): Promise<ApiResponseDto<BaseResponseDto>> {
    return this.client.request<ApiResponseDto<BaseResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/workspaces/${encodeURIComponent(String(params.workspaceId))}/bases`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
