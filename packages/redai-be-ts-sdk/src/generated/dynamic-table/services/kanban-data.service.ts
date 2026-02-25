/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  GroupedListItem,
  ListGroupedRecordsParams,
} from '../types';

export class KanbanDataService {
  constructor(private readonly client: HttpClient) {}

  async listGroupedRecords(params: ListGroupedRecordsParams): Promise<ApiResponseDto<GroupedListItem[]>> {
    return this.client.request<ApiResponseDto<GroupedListItem[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/kanbans/${encodeURIComponent(String(params.viewId))}/grouped`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }
}
