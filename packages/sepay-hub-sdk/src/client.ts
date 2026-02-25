import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, Method } from "axios";

import { AccessTokenDto } from "./types";
import { SepayHubError } from "./errors";
import {
  getBusinessErrorPolicy,
  isSuccessCode,
  SepayOperationKey,
  SEPAY_OPERATION_POLICY
} from "./error-policy";

export interface SepayHubClientOptions {
  baseUrl?: string;
  clientId: string;
  clientSecret: string;
  timeoutMs?: number;
  tokenRefreshBufferSeconds?: number;
}

export interface SepayApiPaginationMeta {
  per_page: number;
  total: number;
  has_more: boolean;
  current_page: number;
  page_count: number;
}

export interface SepayApiEnvelope<TData> {
  code?: number;
  message?: string;
  id?: string;
  data?: TData;
  meta?: SepayApiPaginationMeta;
}

type AuthMode = "basic" | "bearer";

export interface RequestOptions {
  operation: string;
  operationKey: SepayOperationKey;
  authMode?: AuthMode;
  requestId?: string | undefined;
  params?: Record<string, string | number | boolean | undefined> | undefined;
}

interface SepayErrorPayload {
  code?: number;
  message?: string;
  [key: string]: unknown;
}

export class SepayHubClient {
  private readonly http: AxiosInstance;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tokenRefreshBufferSeconds: number;

  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(options: SepayHubClientOptions) {
    const baseUrl = (options.baseUrl ?? "https://partner-api.sepay.vn/merchant/v1").replace(/\/+$/, "");

    if (!options.clientId || !options.clientSecret) {
      throw new SepayHubError("Thiếu cấu hình clientId hoặc clientSecret cho SePay Hub", {
        code: "CONFIGURATION_ERROR"
      });
    }

    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.tokenRefreshBufferSeconds = options.tokenRefreshBufferSeconds ?? 60;
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: options.timeoutMs ?? 30000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  }

  async get<TData>(path: string, options: RequestOptions): Promise<SepayApiEnvelope<TData>> {
    return this.request<TData>("GET", path, undefined, options);
  }

  async post<TData, TBody = unknown>(
    path: string,
    body: TBody,
    options: RequestOptions
  ): Promise<SepayApiEnvelope<TData>> {
    return this.request<TData>("POST", path, body, options);
  }

  async createAccessToken(): Promise<AccessTokenDto["data"]> {
    const response = await this.post<AccessTokenDto["data"], Record<string, never>>("/token/create", {}, {
      operation: "tạo access token",
      operationKey: "token.create",
      authMode: "basic"
    });

    const token = response.data;
    if (!token?.access_token || typeof token.ttl !== "number") {
      throw new SepayHubError("Phản hồi token từ SePay Hub không hợp lệ", {
        code: "UNEXPECTED_RESPONSE",
        operation: "tạo access token",
        details: response
      });
    }

    this.accessToken = token.access_token;
    this.tokenExpiresAt = Date.now() + Math.max(1, token.ttl - this.tokenRefreshBufferSeconds) * 1000;
    return token;
  }

  private async request<TData>(
    method: Method,
    path: string,
    body: unknown,
    options: RequestOptions
  ): Promise<SepayApiEnvelope<TData>> {
    const authMode = options.authMode ?? "bearer";
    const headers: Record<string, string> = {
      "Client-Message-Id": this.generateClientMessageId()
    };

    if (options.requestId) {
      headers["Request-Id"] = options.requestId;
    }

    if (authMode === "basic") {
      headers.Authorization = this.createBasicAuthorization();
    } else {
      const token = await this.ensureAccessToken();
      headers.Authorization = `Bearer ${token}`;
    }

    const config: AxiosRequestConfig = {
      method,
      url: path,
      data: body,
      params: options.params,
      headers
    };

    try {
      const response = await this.http.request<SepayApiEnvelope<TData>>(config);
      this.ensureBusinessSuccess(response.data, options);
      return response.data;
    } catch (error: unknown) {
      throw this.mapAxiosError(error, options.operation, options.operationKey, options.requestId);
    }
  }

  private ensureBusinessSuccess<TData>(payload: SepayApiEnvelope<TData>, options: RequestOptions): void {
    const policy = SEPAY_OPERATION_POLICY[options.operationKey];
    if (policy.allowMissingCode && payload.code === undefined) {
      return;
    }

    if (payload.code === undefined) {
      if (policy.successCodes && policy.successCodes.length > 0) {
        throw new SepayHubError(`Phản hồi SePay thiếu mã trạng thái nghiệp vụ khi ${options.operation}`, {
          code: "UNEXPECTED_RESPONSE",
          operation: options.operation,
          requestId: options.requestId,
          details: payload
        });
      }
      return;
    }

    if (isSuccessCode(options.operationKey, payload.code)) {
      return;
    }

    const mapped = getBusinessErrorPolicy(options.operationKey, payload.code);
    throw new SepayHubError(
      mapped?.message ?? `SePay trả mã lỗi nghiệp vụ ${payload.code} khi ${options.operation}`,
      {
        code: mapped?.category ?? "API_ERROR",
        operation: options.operation,
        requestId: options.requestId,
        details: payload,
        retryable: mapped?.retryable ?? false
      }
    );
  }

  private async ensureAccessToken(): Promise<string> {
    const now = Date.now();
    if (!this.accessToken || now >= this.tokenExpiresAt) {
      await this.createAccessToken();
    }

    if (!this.accessToken) {
      throw new SepayHubError("Không thể lấy access token từ SePay Hub", {
        code: "AUTHENTICATION_ERROR"
      });
    }

    return this.accessToken;
  }

  private createBasicAuthorization(): string {
    const raw = `${this.clientId}:${this.clientSecret}`;
    const encoded = Buffer.from(raw, "utf-8").toString("base64");
    return `Basic ${encoded}`;
  }

  private generateClientMessageId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private mapAxiosError(
    error: unknown,
    operation: string,
    operationKey: SepayOperationKey,
    requestId?: string
  ): SepayHubError {
    if (!(error instanceof AxiosError)) {
      return new SepayHubError(`Lỗi không xác định khi ${operation}`, {
        code: "API_ERROR",
        operation,
        requestId,
        cause: error
      });
    }

    if (error.code === "ECONNABORTED") {
      return new SepayHubError(`Hết thời gian chờ khi ${operation}`, {
        code: "TIMEOUT_ERROR",
        operation,
        requestId,
        cause: error,
        retryable: true
      });
    }

    if (!error.response) {
      return new SepayHubError(`Không thể kết nối SePay Hub khi ${operation}`, {
        code: "NETWORK_ERROR",
        operation,
        requestId,
        cause: error,
        retryable: true
      });
    }

    const status = error.response.status;
    const payload = (error.response.data ?? {}) as SepayErrorPayload;
    const message = payload.message ?? error.message;

    if (typeof payload.code === "number") {
      const mappedBusiness = getBusinessErrorPolicy(operationKey, payload.code);
      if (mappedBusiness) {
        return new SepayHubError(mappedBusiness.message, {
          code: mappedBusiness.category,
          status,
          operation,
          requestId,
          details: payload,
          cause: error,
          retryable: mappedBusiness.retryable
        });
      }
    }

    if (status === 400) {
      return new SepayHubError(`SePay Hub trả lỗi dữ liệu đầu vào khi ${operation}: ${message}`, {
        code: "VALIDATION_ERROR",
        status,
        operation,
        requestId,
        details: payload,
        cause: error,
        retryable: false
      });
    }

    if (status === 401 || status === 403) {
      return new SepayHubError(`SePay Hub từ chối xác thực khi ${operation}: ${message}`, {
        code: "AUTHENTICATION_ERROR",
        status,
        operation,
        requestId,
        details: payload,
        cause: error,
        retryable: false
      });
    }

    if (status === 409) {
      return new SepayHubError(`SePay Hub từ chối do xung đột trạng thái khi ${operation}: ${message}`, {
        code: "VALIDATION_ERROR",
        status,
        operation,
        requestId,
        details: payload,
        cause: error,
        retryable: false
      });
    }

    return new SepayHubError(`SePay Hub lỗi khi ${operation}: ${message}`, {
      code: "API_ERROR",
      status,
      operation,
      requestId,
      details: payload,
      cause: error,
      retryable: status >= 500
    });
  }
}
