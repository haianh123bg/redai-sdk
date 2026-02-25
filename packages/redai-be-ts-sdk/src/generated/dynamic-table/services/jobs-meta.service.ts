/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CancelJobParams,
  GetJobParams,
  ImportJobResponseDto,
  ListJobsParams,
  RetryJobParams,
} from '../types';

export class JobsMetaService {
  constructor(private readonly client: HttpClient) {}

  async listJobs(params?: ListJobsParams): Promise<ApiResponseDto<ImportJobResponseDto[]>> {
    return this.client.request<ApiResponseDto<ImportJobResponseDto[]>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/jobs`,
      params: params?.query,
      data: undefined,
      headers: undefined,
    });
  }

  async getJob(params: GetJobParams): Promise<ApiResponseDto<ImportJobResponseDto>> {
    return this.client.request<ApiResponseDto<ImportJobResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/jobs/${encodeURIComponent(String(params.jobId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async cancelJob(params: CancelJobParams): Promise<ApiResponseDto<{ id: string; status: string; }>> {
    return this.client.request<ApiResponseDto<{ id: string; status: string; }>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/jobs/${encodeURIComponent(String(params.jobId))}/cancel`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async retryJob(params: RetryJobParams): Promise<ApiResponseDto<{ id: string; status: string; }>> {
    return this.client.request<ApiResponseDto<{ id: string; status: string; }>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/jobs/${encodeURIComponent(String(params.jobId))}/retry`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }
}
