/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateKanbanViewParams,
  GetKanbanViewParams,
  KanbanViewDetailResponseDto,
  KanbanViewResponseDto,
  UpdateKanbanViewParams,
  ViewResponseDto,
} from '../types';

export class KanbansService {
  constructor(private readonly client: HttpClient) {}

  async getKanbanView(params: GetKanbanViewParams): Promise<ApiResponseDto<KanbanViewDetailResponseDto>> {
    return this.client.request<ApiResponseDto<KanbanViewDetailResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/kanbans/${encodeURIComponent(String(params.kanbanViewId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateKanbanView(params: UpdateKanbanViewParams): Promise<ApiResponseDto<KanbanViewResponseDto>> {
    return this.client.request<ApiResponseDto<KanbanViewResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/kanbans/${encodeURIComponent(String(params.kanbanViewId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createKanbanView(params: CreateKanbanViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/kanbans`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
