/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  PinParams,
  RecentParams,
  SearchParams,
} from '../types';

export class CommandPaletteService {
  constructor(private readonly client: HttpClient) {}

  async pin(params: PinParams): Promise<ApiResponseDto<Record<string, unknown>[]>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>[]>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/command-palette/pin`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async recent(params?: RecentParams): Promise<ApiResponseDto<Record<string, unknown>[]>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/command-palette/recent`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async search(params?: SearchParams): Promise<ApiResponseDto<Record<string, unknown>[]>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/command-palette/search`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }
}
