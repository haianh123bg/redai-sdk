/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  RecordAuditParams,
  ReindexTableParams,
  RunOperationParams,
} from '../types';

export class InternalService {
  constructor(private readonly client: HttpClient) {}

  async recordAudit(params: RecordAuditParams): Promise<ApiResponseDto<Record<string, unknown>[]>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/internal/audit/${encodeURIComponent(String(params.recordId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async runOperation(params: RunOperationParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/internal/operations/${encodeURIComponent(String(params.name))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async reindexTable(params: ReindexTableParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/internal/reindex/${encodeURIComponent(String(params.tableId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
