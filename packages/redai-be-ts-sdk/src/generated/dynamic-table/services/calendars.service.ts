/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CalendarViewDetailResponseDto,
  CalendarViewResponseDto,
  CreateCalendarViewParams,
  GetCalendarViewParams,
  UpdateCalendarViewParams,
  ViewResponseDto,
} from '../types';

export class CalendarsService {
  constructor(private readonly client: HttpClient) {}

  async getCalendarView(params: GetCalendarViewParams): Promise<ApiResponseDto<CalendarViewDetailResponseDto>> {
    return this.client.request<ApiResponseDto<CalendarViewDetailResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/calendars/${encodeURIComponent(String(params.calendarViewId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateCalendarView(params: UpdateCalendarViewParams): Promise<ApiResponseDto<CalendarViewResponseDto>> {
    return this.client.request<ApiResponseDto<CalendarViewResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/calendars/${encodeURIComponent(String(params.calendarViewId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createCalendarView(params: CreateCalendarViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/calendars`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
