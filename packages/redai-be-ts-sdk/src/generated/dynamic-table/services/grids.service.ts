/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateGridViewParams,
  GridViewResponseDto,
  UpdateGridViewParams,
  ViewResponseDto,
} from '../types';

export class GridsService {
  constructor(private readonly client: HttpClient) {}

  async updateGridView(params: UpdateGridViewParams): Promise<ApiResponseDto<GridViewResponseDto>> {
    return this.client.request<ApiResponseDto<GridViewResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/grids/${encodeURIComponent(String(params.viewId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createGridView(params: CreateGridViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/grids`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
