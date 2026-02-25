/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateTableParams,
  DeleteTableParams,
  GetTableParams,
  ListTablesParams,
  PagedResponse,
  ReorderTablesParams,
  TableResponseDto,
  UpdateTableParams,
} from '../types';

export class TablesService {
  constructor(private readonly client: HttpClient) {}

  async listTables(params?: ListTablesParams): Promise<ApiResponseDto<PagedResponse<TableResponseDto>>> {
    return this.client.request<ApiResponseDto<PagedResponse<TableResponseDto>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/tables`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async createTable(params: CreateTableParams): Promise<ApiResponseDto<TableResponseDto>> {
    return this.client.request<ApiResponseDto<TableResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async deleteTable(params: DeleteTableParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getTable(params: GetTableParams): Promise<ApiResponseDto<TableResponseDto>> {
    return this.client.request<ApiResponseDto<TableResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async updateTable(params: UpdateTableParams): Promise<ApiResponseDto<TableResponseDto>> {
    return this.client.request<ApiResponseDto<TableResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async reorderTables(params: ReorderTablesParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/reorder`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
