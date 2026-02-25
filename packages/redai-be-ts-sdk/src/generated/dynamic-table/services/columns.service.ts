/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  BulkColumnsParams,
  ColumnResponseDto,
  CreateColumnParams,
  DeleteColumnParams,
  GetColumnParams,
  GetColumnsHashParams,
  ReorderColumnsParams,
  SetPrimaryColumnParams,
  UpdateColumnParams,
} from '../types';

export class ColumnsService {
  constructor(private readonly client: HttpClient) {}

  async deleteColumn(params: DeleteColumnParams): Promise<ApiResponseDto<void>> {
    return this.client.request<ApiResponseDto<void>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/columns/${encodeURIComponent(String(params.columnId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getColumn(params: GetColumnParams): Promise<ApiResponseDto<ColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ColumnResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/columns/${encodeURIComponent(String(params.columnId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateColumn(params: UpdateColumnParams): Promise<ApiResponseDto<ColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ColumnResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/columns/${encodeURIComponent(String(params.columnId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async setPrimaryColumn(params: SetPrimaryColumnParams): Promise<ApiResponseDto<ColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ColumnResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/columns/${encodeURIComponent(String(params.columnId))}/primary`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async createColumn(params: CreateColumnParams): Promise<ApiResponseDto<ColumnResponseDto>> {
    return this.client.request<ApiResponseDto<ColumnResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/columns`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async bulkColumns(params: BulkColumnsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/columns/bulk`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async getColumnsHash(params: GetColumnsHashParams): Promise<ApiResponseDto<{ hash: string; total: number; }>> {
    return this.client.request<ApiResponseDto<{ hash: string; total: number; }>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/columns/hash`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async reorderColumns(params: ReorderColumnsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/columns/reorder`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
