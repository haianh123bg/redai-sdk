/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreatePresignedUrlParams,
  DeleteAttachmentParams,
  GetAttachmentParams,
  UploadParams,
} from '../types';

export class AttachmentsService {
  constructor(private readonly client: HttpClient) {}

  async deleteAttachment(params: DeleteAttachmentParams): Promise<ApiResponseDto<null>> {
    return this.client.request<ApiResponseDto<null>>({
      method: 'DELETE',
      url: `/v1/dynamic-table/storage/${encodeURIComponent(String(params.attachmentId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async getAttachment(params: GetAttachmentParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/storage/${encodeURIComponent(String(params.attachmentId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async createPresignedUrl(params: CreatePresignedUrlParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/storage/presigned-url`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async upload(params: UploadParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/storage/upload`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
