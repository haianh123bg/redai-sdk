/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateFormViewParams,
  FormViewDetailResponseDto,
  FormViewResponseDto,
  GetFormViewParams,
  UpdateFormViewParams,
  ViewResponseDto,
} from '../types';

export class FormsService {
  constructor(private readonly client: HttpClient) {}

  async getFormView(params: GetFormViewParams): Promise<ApiResponseDto<FormViewDetailResponseDto>> {
    return this.client.request<ApiResponseDto<FormViewDetailResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/forms/${encodeURIComponent(String(params.formViewId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateFormView(params: UpdateFormViewParams): Promise<ApiResponseDto<FormViewResponseDto>> {
    return this.client.request<ApiResponseDto<FormViewResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/forms/${encodeURIComponent(String(params.formViewId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createFormView(params: CreateFormViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/forms`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
