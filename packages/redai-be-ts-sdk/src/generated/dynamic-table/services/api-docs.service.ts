/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  OpenApiJsonParams,
  RedocParams,
  SwaggerParams,
} from '../types';

export class ApiDocsService {
  constructor(private readonly client: HttpClient) {}

  async openApiJson(params?: OpenApiJsonParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/api-docs/openapi.json`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async redoc(params?: RedocParams): Promise<ApiResponseDto<string>> {
    return this.client.request<ApiResponseDto<string>>({
      method: 'GET',
      url: `/v1/dynamic-table/api-docs/redoc`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async swagger(params?: SwaggerParams): Promise<ApiResponseDto<string>> {
    return this.client.request<ApiResponseDto<string>>({
      method: 'GET',
      url: `/v1/dynamic-table/api-docs/swagger`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
