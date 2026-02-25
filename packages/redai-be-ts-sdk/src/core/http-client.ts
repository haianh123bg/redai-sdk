import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { DynamicTableAuth } from './auth';
import { DynamicTableSdkConfig } from './types';

export class HttpClient {
  private readonly instance: AxiosInstance;

  constructor(config: DynamicTableSdkConfig, private readonly auth: DynamicTableAuth) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.defaultHeaders ?? {}),
      },
    });

    this.instance.interceptors.request.use(async (requestConfig) => {
      const state = await this.auth.resolveState();

      if (state.bearerToken) {
        requestConfig.headers.Authorization = `Bearer ${state.bearerToken}`;
      } else if (requestConfig.headers.Authorization) {
        delete requestConfig.headers.Authorization;
      }

      if (state.dtApiToken) {
        requestConfig.headers['x-dt-api-token'] = state.dtApiToken;
      } else if (requestConfig.headers['x-dt-api-token']) {
        delete requestConfig.headers['x-dt-api-token'];
      }

      return requestConfig;
    });
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<T>(config);
    return response.data;
  }
}
