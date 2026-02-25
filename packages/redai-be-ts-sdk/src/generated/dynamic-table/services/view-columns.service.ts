/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  BulkUpdateViewColumnsParams,
  CreateViewColumnParams,
  ListGridColumnsParams,
  ListViewColumnsParams,
  UpdateFormColumnParams,
  UpdateGridColumnParams,
  UpdateViewColumnParams,
  ViewColumnResponseDto,
} from '../types';

export class ViewColumnsService {
  constructor(private readonly client: HttpClient) {}

  async updateFormColumn(params: UpdateFormColumnParams): Promise<ApiResponseDto<ViewColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ViewColumnResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/form-columns/${encodeURIComponent(String(params.formViewColumnId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async updateGridColumn(params: UpdateGridColumnParams): Promise<ApiResponseDto<ViewColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ViewColumnResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/grid-columns/${encodeURIComponent(String(params.gridViewColumnId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listGridColumns(params: ListGridColumnsParams): Promise<ApiResponseDto<ViewColumnResponseDto[]>> {
    return this.client.request<ApiResponseDto<ViewColumnResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/grids/${encodeURIComponent(String(params.gridViewId))}/grid-columns`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async listViewColumns(params: ListViewColumnsParams): Promise<ApiResponseDto<ViewColumnResponseDto[]>> {
    return this.client.request<ApiResponseDto<ViewColumnResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/columns`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async bulkUpdateViewColumns(params: BulkUpdateViewColumnsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/columns`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createViewColumn(params: CreateViewColumnParams): Promise<ApiResponseDto<ViewColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ViewColumnResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/columns`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async updateViewColumn(params: UpdateViewColumnParams): Promise<ApiResponseDto<ViewColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ViewColumnResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/columns/${encodeURIComponent(String(params.columnId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
