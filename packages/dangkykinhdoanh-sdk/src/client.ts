import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

export interface DangKyKinhDoanhClientOptions {
  baseUrl?: string;
  axios?: AxiosInstance;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export class DangKyKinhDoanhError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, options?: { status?: number; body?: unknown }) {
    super(message);
    this.name = "DangKyKinhDoanhError";
    this.status = options?.status;
    this.body = options?.body;
  }
}

export class DangKyKinhDoanhClient {
  private axios: AxiosInstance;
  private headers?: Record<string, string>;
  readonly baseUrl: string;

  constructor(options: DangKyKinhDoanhClientOptions = {}) {
    const baseUrl = options.baseUrl ?? options.axios?.defaults.baseURL ?? "https://dangkykinhdoanh.gov.vn";

    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.headers = options.headers;
    this.axios = options.axios ??
      axios.create({
        baseURL: this.baseUrl,
        timeout: options.timeoutMs ?? 30000,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          ...options.headers
        }
      });
  }

  buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    if (!path.startsWith("/")) {
      return `${this.baseUrl}/${path}`;
    }

    return `${this.baseUrl}${path}`;
  }

  async requestRaw<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const { data, ...rest } = config;
      return await this.axios.request<T>({
        ...rest,
        data: data ? this.encodeFormData(data) : undefined,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          ...this.headers,
          ...config.headers
        }
      });
    } catch (err: unknown) {
      throw toDangKyKinhDoanhError(err);
    }
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const res = await this.requestRaw<T>(config);
    return res.data;
  }

  async post<T>(path: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: "POST",
      url: this.buildUrl(path),
      data
    });
  }

  private encodeFormData(data: Record<string, any>): string {
    return Object.entries(data)
      .map(([key, value]) => 
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
  }
}

function toDangKyKinhDoanhError(err: unknown): DangKyKinhDoanhError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const body = err.response?.data ?? err.message;
    const message = status
      ? `Request failed with status ${status}`
      : "Request failed";
    return new DangKyKinhDoanhError(message, { status, body });
  }

  if (err instanceof DangKyKinhDoanhError) {
    return err;
  }

  return new DangKyKinhDoanhError("Request failed", { body: err });
}
