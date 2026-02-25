/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  CreateMapViewParams,
  GetMapViewParams,
  MapViewDetailResponseDto,
  MapViewResponseDto,
  UpdateMapViewParams,
  ViewResponseDto,
} from '../types';

export class MapsService {
  constructor(private readonly client: HttpClient) {}

  async getMapView(params: GetMapViewParams): Promise<ApiResponseDto<MapViewDetailResponseDto>> {
    return this.client.request<ApiResponseDto<MapViewDetailResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/maps/${encodeURIComponent(String(params.mapViewId))}`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateMapView(params: UpdateMapViewParams): Promise<ApiResponseDto<MapViewResponseDto>> {
    return this.client.request<ApiResponseDto<MapViewResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/maps/${encodeURIComponent(String(params.mapViewId))}`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }

  async createMapView(params: CreateMapViewParams): Promise<ApiResponseDto<ViewResponseDto>> {
    return this.client.request<ApiResponseDto<ViewResponseDto>>({
      method: 'POST',
      url: `/v1/dynamic-table/db/meta/tables/${encodeURIComponent(String(params.tableId))}/maps`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
