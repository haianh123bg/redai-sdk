/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  FilterResponseDto,
  HookCreateParams,
  HookDeleteParams,
  HookFilterCreateParams,
  HookFilterDeleteParams,
  HookFilterListParams,
  HookFilterUpdateParams,
  HookListParams,
  HookLogListParams,
  HookLogResponseDto,
  HookResponseDto,
  HookTestParams,
  HookTriggerParams,
  HookUpdateParams,
  PagedResponse,
  TableSampleDataParams,
} from '../types';

export class HooksService {
  constructor(private readonly client: HttpClient) {}

  async hookDelete(params: HookDeleteParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async hookUpdate(params: HookUpdateParams): Promise<ApiResponseDto<HookResponseDto>> {
    return this.client.request<ApiResponseDto<HookResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async hookFilterList(params: HookFilterListParams): Promise<ApiResponseDto<FilterResponseDto[]>> {
    return this.client.request<ApiResponseDto<FilterResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}/filters`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async hookFilterCreate(params: HookFilterCreateParams): Promise<ApiResponseDto<FilterResponseDto>> {
    return this.client.request<ApiResponseDto<FilterResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}/filters`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async hookFilterDelete(params: HookFilterDeleteParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}/filters/${encodeURIComponent(String(params.filterId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async hookFilterUpdate(params: HookFilterUpdateParams): Promise<ApiResponseDto<FilterResponseDto>> {
    return this.client.request<ApiResponseDto<FilterResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}/filters/${encodeURIComponent(String(params.filterId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async hookLogList(params: HookLogListParams): Promise<ApiResponseDto<PagedResponse<HookLogResponseDto>>> {
    return this.client.request<ApiResponseDto<PagedResponse<HookLogResponseDto>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}/logs`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async hookTrigger(params: HookTriggerParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/hooks/${encodeURIComponent(String(params.hookId))}/trigger/${encodeURIComponent(String(params.rowId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async hookList(params: HookListParams): Promise<ApiResponseDto<PagedResponse<HookResponseDto>>> {
    return this.client.request<ApiResponseDto<PagedResponse<HookResponseDto>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/hooks`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async hookCreate(params: HookCreateParams): Promise<ApiResponseDto<HookResponseDto>> {
    return this.client.request<ApiResponseDto<HookResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/hooks`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async tableSampleData(params: TableSampleDataParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/hooks/samplePayload/${encodeURIComponent(String(params.event))}/${encodeURIComponent(String(params.operation))}/${encodeURIComponent(String(params.version))}`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async hookTest(params: HookTestParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/hooks/test`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
