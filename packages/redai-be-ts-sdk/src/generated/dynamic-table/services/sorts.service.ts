/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateSortParams,
  DeleteSortParams,
  GetSortParams,
  ListSortsParams,
  ReorderSortsParams,
  SortResponseDto,
  UpdateSortParams,
} from '../types';

export class SortsService {
  constructor(private readonly client: HttpClient) {}

  async deleteSort(params: DeleteSortParams): Promise<ApiResponseDto<void>> {
    return this.client.request<ApiResponseDto<void>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/sorts/${encodeURIComponent(String(params.sortId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getSort(params: GetSortParams): Promise<ApiResponseDto<SortResponseDto>> {
    return this.client.request<ApiResponseDto<SortResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/sorts/${encodeURIComponent(String(params.sortId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateSort(params: UpdateSortParams): Promise<ApiResponseDto<SortResponseDto>> {
    return this.client.request<ApiResponseDto<SortResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/sorts/${encodeURIComponent(String(params.sortId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listSorts(params: ListSortsParams): Promise<ApiResponseDto<SortResponseDto[]>> {
    return this.client.request<ApiResponseDto<SortResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/sorts`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async createSort(params: CreateSortParams): Promise<ApiResponseDto<SortResponseDto>> {
    return this.client.request<ApiResponseDto<SortResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/sorts`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async reorderSorts(params: ReorderSortsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/sorts/reorder`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
