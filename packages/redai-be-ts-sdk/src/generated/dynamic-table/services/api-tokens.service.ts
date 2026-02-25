/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateApiTokenParams,
  DeleteApiTokenParams,
  ListApiTokensParams,
  UpdateApiTokenParams,
} from '../types';

export class ApiTokensService {
  constructor(private readonly client: HttpClient) {}

  async listApiTokens(params?: ListApiTokensParams): Promise<ApiResponseDto<Record<string, unknown>[]>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/api-tokens`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async createApiToken(params: CreateApiTokenParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/api-tokens`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async deleteApiToken(params: DeleteApiTokenParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/api-tokens/${encodeURIComponent(String(params.tokenId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateApiToken(params: UpdateApiTokenParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/api-tokens/${encodeURIComponent(String(params.tokenId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
