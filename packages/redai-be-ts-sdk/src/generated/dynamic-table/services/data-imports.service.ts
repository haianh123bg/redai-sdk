/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  AbortImportJobParams,
  ApiResponseDto,
  GetImportJobParams,
  ImportFromUrlParams,
  ImportJobResponseDto,
  ImportPreviewResponseDto,
  ImportStartResponseDto,
  ImportUploadResponseDto,
  PreviewImportFileParams,
  StartImportParams,
  UploadImportFileParams,
} from '../types';

export class DataImportsService {
  constructor(private readonly client: HttpClient) {}

  async startImport(params: StartImportParams): Promise<ApiResponseDto<ImportStartResponseDto>> {
    return this.client.request<ApiResponseDto<ImportStartResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/data/imports`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async getImportJob(params: GetImportJobParams): Promise<ApiResponseDto<ImportJobResponseDto>> {
    return this.client.request<ApiResponseDto<ImportJobResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/data/imports/${encodeURIComponent(String(params.jobId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async abortImportJob(params: AbortImportJobParams): Promise<ApiResponseDto<{ id: string; status: string; }>> {
    return this.client.request<ApiResponseDto<{ id: string; status: string; }>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/data/imports/${encodeURIComponent(String(params.jobId))}/abort`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async previewImportFile(params: PreviewImportFileParams): Promise<ApiResponseDto<ImportPreviewResponseDto>> {
    return this.client.request<ApiResponseDto<ImportPreviewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/data/imports/preview`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async uploadImportFile(params: UploadImportFileParams): Promise<ApiResponseDto<ImportUploadResponseDto>> {
    return this.client.request<ApiResponseDto<ImportUploadResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/data/imports/upload`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async importFromUrl(params: ImportFromUrlParams): Promise<ApiResponseDto<ImportUploadResponseDto>> {
    return this.client.request<ApiResponseDto<ImportUploadResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/data/imports/url`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
