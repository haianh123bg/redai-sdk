/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  ClearRowColorParams,
  CreateRowColorConditionParams,
  DeleteRowColorConditionParams,
  GetRowColorParams,
  RowColorConditionResponseDto,
  RowColorConfigResponseDto,
  UpdateRowColorConditionParams,
  UpdateRowColorModeParams,
} from '../types';

export class RowColorService {
  constructor(private readonly client: HttpClient) {}

  async createRowColorCondition(params: CreateRowColorConditionParams): Promise<ApiResponseDto<RowColorConditionResponseDto>> {
    return this.client.request<ApiResponseDto<RowColorConditionResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/row-color-conditions`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async deleteRowColorCondition(params: DeleteRowColorConditionParams): Promise<ApiResponseDto<void>> {
    return this.client.request<ApiResponseDto<void>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/row-color-conditions/${encodeURIComponent(String(params.id))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateRowColorCondition(params: UpdateRowColorConditionParams): Promise<ApiResponseDto<RowColorConditionResponseDto>> {
    return this.client.request<ApiResponseDto<RowColorConditionResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/row-color-conditions/${encodeURIComponent(String(params.id))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async updateRowColorMode(params: UpdateRowColorModeParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/row-color-select`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async clearRowColor(params: ClearRowColorParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/row-color`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getRowColor(params: GetRowColorParams): Promise<ApiResponseDto<RowColorConfigResponseDto>> {
    return this.client.request<ApiResponseDto<RowColorConfigResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/row-color`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
