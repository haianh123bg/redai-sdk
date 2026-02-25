export type Nullable<T> = T | null;

export interface ApiResponseDto<T> {
  code: number;
  message: string;
  result: T;
}

export type MaybePromise<T> = T | Promise<T>;

export interface DynamicTableTokenProvider {
  getBearerToken?: () => MaybePromise<string | null | undefined>;
  getDtApiToken?: () => MaybePromise<string | null | undefined>;
}

export interface DynamicTableSdkConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  bearerToken?: string | null;
  dtApiToken?: string | null;
  tokenProvider?: DynamicTableTokenProvider;
}
