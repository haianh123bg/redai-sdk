/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CountByDateParams,
  CountRangeParams,
  ListCalendarRecordsParams,
  PagedResponse,
  TableRecord,
} from '../types';

export class CalendarDataService {
  constructor(private readonly client: HttpClient) {}

  async listCalendarRecords(params: ListCalendarRecordsParams): Promise<ApiResponseDto<PagedResponse<TableRecord>>> {
    return this.client.request<ApiResponseDto<PagedResponse<TableRecord>>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/calendars/${encodeURIComponent(String(params.viewId))}/records`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async countByDate(params: CountByDateParams): Promise<ApiResponseDto<{ count: number; dates: string[]; }>> {
    return this.client.request<ApiResponseDto<{ count: number; dates: string[]; }>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/calendars/${encodeURIComponent(String(params.viewId))}/records/count-by-date`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async countRange(params: CountRangeParams): Promise<ApiResponseDto<{ count: number; }>> {
    return this.client.request<ApiResponseDto<{ count: number; }>>({
      method: 'GET',
      url: `/v1/dynamic-table/tables/${encodeURIComponent(String(params.tableId))}/calendars/${encodeURIComponent(String(params.viewId))}/records/count-range`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }
}
