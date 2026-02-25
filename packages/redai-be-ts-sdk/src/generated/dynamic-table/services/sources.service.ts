/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateSourceParams,
  DeleteSourceParams,
  GetSourceParams,
  ListSourcesParams,
  PagedResponse,
  SourceResponseDto,
  UpdateSourceParams,
} from '../types';

export class SourcesService {
  constructor(private readonly client: HttpClient) {}

  async listSources(params: ListSourcesParams): Promise<ApiResponseDto<PagedResponse<SourceResponseDto>>> {
    return this.client.request<ApiResponseDto<PagedResponse<SourceResponseDto>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}/sources`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async createSource(params: CreateSourceParams): Promise<ApiResponseDto<SourceResponseDto>> {
    return this.client.request<ApiResponseDto<SourceResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/bases/${encodeURIComponent(String(params.baseId))}/sources`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async deleteSource(params: DeleteSourceParams): Promise<ApiResponseDto<SourceResponseDto>> {
    return this.client.request<ApiResponseDto<SourceResponseDto>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/sources/${encodeURIComponent(String(params.sourceId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getSource(params: GetSourceParams): Promise<ApiResponseDto<SourceResponseDto>> {
    return this.client.request<ApiResponseDto<SourceResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/sources/${encodeURIComponent(String(params.sourceId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateSource(params: UpdateSourceParams): Promise<ApiResponseDto<SourceResponseDto>> {
    return this.client.request<ApiResponseDto<SourceResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/sources/${encodeURIComponent(String(params.sourceId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
