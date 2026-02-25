/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateViewParams,
  DeleteViewParams,
  DuplicateViewParams,
  GetViewParams,
  HideViewParams,
  ListViewsParams,
  SetDefaultViewParams,
  ShowViewParams,
  UpdateViewParams,
  ViewResponseDto,
} from '../types';

export class ViewsService {
  constructor(private readonly client: HttpClient) {}

  async listViews(params: ListViewsParams): Promise<ApiResponseDto<ViewResponseDto[]>> {
    return this.client.request<ApiResponseDto<ViewResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/views`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async createView(params: CreateViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/views`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async deleteView(params: DeleteViewParams): Promise<ApiResponseDto<void>> {
    return this.client.request<ApiResponseDto<void>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getView(params: GetViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async updateView(params: UpdateViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async setDefaultView(params: SetDefaultViewParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/default`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async duplicateView(params: DuplicateViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/duplicate`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async hideView(params: HideViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/hide-all`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async showView(params: ShowViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/views/${encodeURIComponent(String(params.viewId))}/show-all`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
