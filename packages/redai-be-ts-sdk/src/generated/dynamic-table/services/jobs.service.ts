/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  ListenParams,
} from '../types';

export class JobsService {
  constructor(private readonly client: HttpClient) {}

  async listen(params: ListenParams): Promise<ApiResponseDto<unknown>> {
    return this.client.request<ApiResponseDto<unknown>>({
      method: 'POST',
      url: `/v1/dynamic-table/jobs/listen`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
