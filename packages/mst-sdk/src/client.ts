import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export interface MstClientOptions {
  baseUrl?: string;
  axios?: AxiosInstance;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export class MstError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, options?: { status?: number; body?: unknown }) {
    super(message);
    this.name = "MstError";
    this.status = options?.status;
    this.body = options?.body;
  }
}

export class MstClient {
  private axios: AxiosInstance;
  private headers?: Record<string, string>;
  readonly baseUrl: string;

  constructor(options: MstClientOptions = {}) {
    const baseUrl = options.baseUrl ?? options.axios?.defaults.baseURL ?? "https://mst.8686.vn";

    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.headers = options.headers;
    this.axios = options.axios ??
      axios.create({
        baseURL: this.baseUrl,
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

    if (!path.startsWith("/")) {
      return `${this.baseUrl}/${path}`;
    }

    return `${this.baseUrl}${path}`;
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: "GET",
      url: this.buildUrl(path)
    });
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const res = await this.axios.request<T>({
        ...config,
        headers: {
          Accept: "application/json",
          ...this.headers,
          ...config.headers
        }
      });

      return res.data;
    } catch (err: unknown) {
      throw toMstError(err);
    }
  }
}

function toMstError(err: unknown): MstError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const body = err.response?.data ?? err.message;
    const message = status
      ? `Request failed with status ${status}`
      : "Request failed";
    return new MstError(message, { status, body });
  }

  if (err instanceof MstError) {
    return err;
  }

  return new MstError("Request failed", { body: err });
}
