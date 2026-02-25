/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateFilterParams,
  DeleteFilterParams,
  FilterResponseDto,
  GetFilterParams,
  ListChildrenParams,
  ListFiltersParams,
  UpdateFilterParams,
} from '../types';

export class FiltersService {
  constructor(private readonly client: HttpClient) {}

  async deleteFilter(params: DeleteFilterParams): Promise<ApiResponseDto<void>> {
    return this.client.request<ApiResponseDto<void>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/filters/${encodeURIComponent(String(params.filterId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getFilter(params: GetFilterParams): Promise<ApiResponseDto<FilterResponseDto>> {
    return this.client.request<ApiResponseDto<FilterResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/filters/${encodeURIComponent(String(params.filterId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateFilter(params: UpdateFilterParams): Promise<ApiResponseDto<FilterResponseDto>> {
    return this.client.request<ApiResponseDto<FilterResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/filters/${encodeURIComponent(String(params.filterId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listChildren(params: ListChildrenParams): Promise<ApiResponseDto<FilterResponseDto[]>> {
    return this.client.request<ApiResponseDto<FilterResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/filters/${encodeURIComponent(String(params.filterParentId))}/children`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async listFilters(params: ListFiltersParams): Promise<ApiResponseDto<FilterResponseDto[]>> {
    return this.client.request<ApiResponseDto<FilterResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/filters`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async createFilter(params: CreateFilterParams): Promise<ApiResponseDto<FilterResponseDto>> {
    return this.client.request<ApiResponseDto<FilterResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/filters`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
