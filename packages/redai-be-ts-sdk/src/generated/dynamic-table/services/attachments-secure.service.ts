/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateSecureTokenParams,
  GetSecureAttachmentParams,
} from '../types';

export class AttachmentsSecureService {
  constructor(private readonly client: HttpClient) {}

  async getSecureAttachment(params: GetSecureAttachmentParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'GET',
      url: `/v1/dynamic-table/storage/secure/${encodeURIComponent(String(params.attachmentId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async createSecureToken(params: CreateSecureTokenParams): Promise<ApiResponseDto<Record<string, unknown>>> {
    return this.client.request<ApiResponseDto<Record<string, unknown>>>({
      method: 'POST',
      url: `/v1/dynamic-table/storage/secure/${encodeURIComponent(String(params.attachmentId))}/token`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
