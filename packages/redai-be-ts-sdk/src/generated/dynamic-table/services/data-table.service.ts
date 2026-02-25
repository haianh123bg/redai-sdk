/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  AggregateRecordsParams,
  ApiResponseDto,
  BulkDataListParams,
  BulkGroupByParams,
  CountRecordsParams,
  CreateRecordsParams,
  DeleteRecordsParams,
  GetRecordParams,
  GroupByParams,
  JsonValue,
  LinkRecordsBulkParams,
  LinkRecordsParams,
  ListLinkedRecordsParams,
  ListRecordsByFieldIdsParams,
  ListRecordsParams,
  MoveRecordParams,
  PagedResponse,
  TableRecord,
  UnlinkRecordsBulkParams,
  UnlinkRecordsParams,
  UpdateRecordFieldParams,
  UpdateRecordsParams,
} from '../types';

export class DataTableService {
  constructor(private readonly client: HttpClient) {}

  async aggregateRecords(params: AggregateRecordsParams): Promise<ApiResponseDto<Record<string, number>>> {
    return this.client.request<ApiResponseDto<Record<string, number>>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/aggregate`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async bulkDataList(params: BulkDataListParams): Promise<ApiResponseDto<PagedResponse<TableRecord>>> {
    return this.client.request<ApiResponseDto<PagedResponse<TableRecord>>>({
      method: 'POST',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/bulk/datalist`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async bulkGroupBy(params: BulkGroupByParams): Promise<ApiResponseDto<PagedResponse<{ groups: Array<{ fieldId: string; value: JsonValue | null; }>; total: number | string; }>>> {
    return this.client.request<ApiResponseDto<PagedResponse<{ groups: Array<{ fieldId: string; value: JsonValue | null; }>; total: number | string; }>>>({
      method: 'POST',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/bulk/group`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async groupBy(params: GroupByParams): Promise<ApiResponseDto<PagedResponse<{ groups: Array<{ fieldId: string; value: JsonValue | null; }>; total: number | string; }>>> {
    return this.client.request<ApiResponseDto<PagedResponse<{ groups: Array<{ fieldId: string; value: JsonValue | null; }>; total: number | string; }>>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/groupby`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async unlinkRecordsBulk(params: UnlinkRecordsBulkParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/links/${encodeURIComponent(String(params.fieldId))}/records`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async linkRecordsBulk(params: LinkRecordsBulkParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/links/${encodeURIComponent(String(params.fieldId))}/records`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async unlinkRecords(params: UnlinkRecordsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/links/${encodeURIComponent(String(params.fieldId))}/records/${encodeURIComponent(String(params.recordId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listLinkedRecords(params: ListLinkedRecordsParams): Promise<ApiResponseDto<{ refRowIds: string[]; }>> {
    return this.client.request<ApiResponseDto<{ refRowIds: string[]; }>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/links/${encodeURIComponent(String(params.fieldId))}/records/${encodeURIComponent(String(params.recordId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async linkRecords(params: LinkRecordsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'POST',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/links/${encodeURIComponent(String(params.fieldId))}/records/${encodeURIComponent(String(params.recordId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listRecordsByFieldIds(params: ListRecordsByFieldIdsParams): Promise<ApiResponseDto<PagedResponse<TableRecord>>> {
    return this.client.request<ApiResponseDto<PagedResponse<TableRecord>>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records-by-field-ids`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async deleteRecords(params: DeleteRecordsParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async listRecords(params: ListRecordsParams): Promise<ApiResponseDto<PagedResponse<TableRecord>>> {
    return this.client.request<ApiResponseDto<PagedResponse<TableRecord>>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async updateRecords(params: UpdateRecordsParams): Promise<ApiResponseDto<TableRecord | TableRecord[]>> {
    return this.client.request<ApiResponseDto<TableRecord | TableRecord[]>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createRecords(params: CreateRecordsParams): Promise<ApiResponseDto<TableRecord | TableRecord[]>> {
    return this.client.request<ApiResponseDto<TableRecord | TableRecord[]>>({
      method: 'POST',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async getRecord(params: GetRecordParams): Promise<ApiResponseDto<TableRecord>> {
    return this.client.request<ApiResponseDto<TableRecord>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records/${encodeURIComponent(String(params.recordId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateRecordField(params: UpdateRecordFieldParams): Promise<ApiResponseDto<TableRecord>> {
    return this.client.request<ApiResponseDto<TableRecord>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records/${encodeURIComponent(String(params.recordId))}/fields/${encodeURIComponent(String(params.fieldId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async moveRecord(params: MoveRecordParams): Promise<ApiResponseDto<TableRecord>> {
    return this.client.request<ApiResponseDto<TableRecord>>({
      method: 'POST',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records/${encodeURIComponent(String(params.recordId))}/move`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async countRecords(params: CountRecordsParams): Promise<ApiResponseDto<{ count: number; }>> {
    return this.client.request<ApiResponseDto<{ count: number; }>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/records/count`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }
}
