/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  InvalidateParams,
  StatsParams,
  WarmupParams,
} from '../types';

export class CachesService {
  constructor(private readonly client: HttpClient) {}

  async invalidate(params: InvalidateParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/cache/invalidate`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async stats(params?: StatsParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/cache/stats`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async warmup(params: WarmupParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/cache/warmup`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
