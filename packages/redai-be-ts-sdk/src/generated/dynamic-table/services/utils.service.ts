/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  EnumsParams,
  HealthParams,
  PermissionsParams,
  VersionParams,
} from '../types';

export class UtilsService {
  constructor(private readonly client: HttpClient) {}

  async enums(params?: EnumsParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/utils/enums`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async health(params?: HealthParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/utils/health`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async permissions(params?: PermissionsParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/utils/me/permissions`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async version(params?: VersionParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/utils/version`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
