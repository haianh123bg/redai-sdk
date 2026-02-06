import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

export interface TimkiemDoanhnghiepClientOptions {
  baseUrl?: string;
  axios?: AxiosInstance;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export class TimkiemDoanhnghiepError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, options?: { status?: number; body?: unknown }) {
    super(message);
    this.name = "TimkiemDoanhnghiepError";
    this.status = options?.status;
    this.body = options?.body;
  }
}

export class TimkiemDoanhnghiepClient {
  private axios: AxiosInstance;
  private headers?: Record<string, string>;
  readonly baseUrl: string;

  constructor(options: TimkiemDoanhnghiepClientOptions = {}) {
    const baseUrl =
      options.baseUrl ??
      options.axios?.defaults.baseURL ??
      "https://timkiemdoanhnghiep.com";

    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.headers = options.headers;
    this.axios =
      options.axios ??
      axios.create({
        baseURL: this.baseUrl,
        timeout: options.timeoutMs,
        headers: {
          Accept: "text/html,application/xhtml+xml",
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
      return await this.axios.request<T>({
        ...config,
        headers: {
          Accept: "text/html,application/xhtml+xml",
          ...this.headers,
          ...config.headers
        }
      });
    } catch (err: unknown) {
      throw toTimkiemDoanhnghiepError(err);
    }
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const res = await this.requestRaw<T>(config);
    return res.data;
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: "GET",
      url: this.buildUrl(path)
    });
  }

  async getText(path: string, config?: AxiosRequestConfig): Promise<string> {
    return this.request<string>({
      ...config,
      method: "GET",
      url: this.buildUrl(path),
      responseType: "text"
    });
  }
}

function toTimkiemDoanhnghiepError(err: unknown): TimkiemDoanhnghiepError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const body = err.response?.data ?? err.message;
    const message = status
      ? `Request failed with status ${status}`
      : "Request failed";
    return new TimkiemDoanhnghiepError(message, { status, body });
  }

  if (err instanceof TimkiemDoanhnghiepError) {
    return err;
  }

  return new TimkiemDoanhnghiepError("Request failed", { body: err });
}
