import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

export interface NeacClientOptions {
  baseUrl?: string;
  axios?: AxiosInstance;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export class NeacError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, options?: { status?: number; body?: unknown }) {
    super(message);
    this.name = "NeacError";
    this.status = options?.status;
    this.body = options?.body;
  }
}

export class NeacClient {
  private axios: AxiosInstance;
  private headers?: Record<string, string>;
  readonly baseUrl: string;

  constructor(options: NeacClientOptions = {}) {
    const baseUrl = options.baseUrl ?? options.axios?.defaults.baseURL ?? "";

    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.headers = options.headers;
    this.axios = options.axios ??
      axios.create({
        baseURL: this.baseUrl || undefined,
        timeout: options.timeoutMs,
        headers: {
          Accept: "application/json",
          ...options.headers
        }
      });
  }

  buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    if (!this.baseUrl) {
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
          Accept: "application/json",
          ...this.headers,
          ...config.headers
        }
      });
    } catch (err: unknown) {
      throw toNeacError(err);
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
}

function toNeacError(err: unknown): NeacError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const body = err.response?.data ?? err.message;
    const message = status
      ? `Request failed with status ${status}`
      : "Request failed";
    return new NeacError(message, { status, body });
  }

  if (err instanceof NeacError) {
    return err;
  }

  return new NeacError("Request failed", { body: err });
}
