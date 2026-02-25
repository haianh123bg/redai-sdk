/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  ExportStartResponseDto,
  StartExportParams,
} from '../types';

export class DataExportsService {
  constructor(private readonly client: HttpClient) {}

  async startExport(params: StartExportParams): Promise<ApiResponseDto<ExportStartResponseDto>> {
    return this.client.request<ApiResponseDto<ExportStartResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/data/tables/${encodeURIComponent(String(params.tableId))}/exports`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
