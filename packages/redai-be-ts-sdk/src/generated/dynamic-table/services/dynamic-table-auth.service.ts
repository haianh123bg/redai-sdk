/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  DynamicTableTokenExchangeResponseDto,
  ExchangeTokenParams,
} from '../types';

export class DynamicTableAuthService {
  constructor(private readonly client: HttpClient) {}

  async exchangeToken(params?: ExchangeTokenParams): Promise<ApiResponseDto<DynamicTableTokenExchangeResponseDto>> {
    return this.client.request<ApiResponseDto<DynamicTableTokenExchangeResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/auth/exchange`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
