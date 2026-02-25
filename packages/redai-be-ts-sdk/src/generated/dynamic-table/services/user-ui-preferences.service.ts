/* eslint-disable */
import { HttpClient } from '../../../core/http-client';
import type {
  ApiResponseDto,
  GetMeUiPreferencesParams,
  GetUserUiPreferencesResponseDto,
  UpdateMeUiPreferencesParams,
} from '../types';

export class UserUiPreferencesService {
  constructor(private readonly client: HttpClient) {}

  async getMeUiPreferences(params?: GetMeUiPreferencesParams): Promise<ApiResponseDto<GetUserUiPreferencesResponseDto>> {
    return this.client.request<ApiResponseDto<GetUserUiPreferencesResponseDto>>({
      method: 'GET',
      url: `/v1/dynamic-table/db/meta/me/ui-preferences`,
      params: undefined,
      data: undefined,
      headers: undefined,
    });
  }

  async updateMeUiPreferences(params: UpdateMeUiPreferencesParams): Promise<ApiResponseDto<GetUserUiPreferencesResponseDto>> {
    return this.client.request<ApiResponseDto<GetUserUiPreferencesResponseDto>>({
      method: 'PATCH',
      url: `/v1/dynamic-table/db/meta/me/ui-preferences`,
      params: undefined,
      data: params?.body,
      headers: undefined,
    });
  }
}
