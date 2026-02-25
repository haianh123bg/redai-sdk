/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateGalleryViewParams,
  GalleryViewDetailResponseDto,
  GalleryViewResponseDto,
  GetGalleryViewParams,
  UpdateGalleryViewParams,
  ViewResponseDto,
} from '../types';

export class GalleriesService {
  constructor(private readonly client: HttpClient) {}

  async getGalleryView(params: GetGalleryViewParams): Promise<ApiResponseDto<GalleryViewDetailResponseDto>> {
    return this.client.request<ApiResponseDto<GalleryViewDetailResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/galleries/${encodeURIComponent(String(params.galleryViewId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateGalleryView(params: UpdateGalleryViewParams): Promise<ApiResponseDto<GalleryViewResponseDto>> {
    return this.client.request<ApiResponseDto<GalleryViewResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/galleries/${encodeURIComponent(String(params.galleryViewId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createGalleryView(params: CreateGalleryViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/galleries`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
