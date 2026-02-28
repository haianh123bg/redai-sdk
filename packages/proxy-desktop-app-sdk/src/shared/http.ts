import type { ApiErrorPayload } from './errors.js';
import { APIError } from './errors.js';
import type { JsonObject, JsonValue } from './types.js';

export interface HttpClientOptions {
  baseUrl: string;
  accessKey?: string;
  managementKey?: string;
  localPassword?: string;
  fetch?: typeof fetch;
}

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

export class BaseHttpClient {
  readonly baseUrl: string;
  protected accessKey?: string;
  protected managementKey?: string;
  protected localPassword?: string;
  protected fetchImpl: typeof fetch;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.accessKey = options.accessKey;
    this.managementKey = options.managementKey;
    this.localPassword = options.localPassword;
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (!this.fetchImpl) {
      throw new Error('fetch is not available; pass options.fetch');
    }
  }

  setAccessKey(key?: string) {
    this.accessKey = key;
  }

  setManagementKey(key?: string) {
    this.managementKey = key;
  }

  setLocalPassword(value?: string) {
    this.localPassword = value;
  }

  getWebsocketUrl(path = '/v1/ws') {
    const base = this.baseUrl.replace(/\/+$/, '');
    const wsBase = base.replace(/^http/, 'ws');
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${wsBase}${normalized}`;
  }

  protected buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>) {
    const url = new URL(path, this.baseUrl);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  protected async requestJson<T>(
    method: string,
    path: string,
    body?: JsonValue,
    options?: RequestOptions,
    auth?: 'access' | 'management' | 'local'
  ) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {})
    };
    this.applyAuth(headers, auth);
    const res = await this.fetchImpl(this.buildUrl(path, options?.query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok) {
      await this.throwApiError(res);
    }
    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  }

  protected async requestText(
    method: string,
    path: string,
    body?: string,
    options?: RequestOptions,
    auth?: 'access' | 'management' | 'local'
  ) {
    const headers: Record<string, string> = {
      ...(options?.headers ?? {})
    };
    this.applyAuth(headers, auth);
    const res = await this.fetchImpl(this.buildUrl(path, options?.query), {
      method,
      headers,
      body
    });
    if (!res.ok) {
      await this.throwApiError(res);
    }
    return res.text();
  }

  protected async requestRaw(
    method: string,
    path: string,
    body?: BodyInit,
    options?: RequestOptions,
    auth?: 'access' | 'management' | 'local'
  ) {
    const headers: Record<string, string> = {
      ...(options?.headers ?? {})
    };
    this.applyAuth(headers, auth);
    const res = await this.fetchImpl(this.buildUrl(path, options?.query), {
      method,
      headers,
      body
    });
    if (!res.ok) {
      await this.throwApiError(res);
    }
    return res;
  }

  protected applyAuth(headers: Record<string, string>, auth?: 'access' | 'management' | 'local') {
    if (auth === 'access' && this.accessKey) {
      headers.Authorization = `Bearer ${this.accessKey}`;
    }
    if (auth === 'management' && this.managementKey) {
      headers.Authorization = `Bearer ${this.managementKey}`;
    }
    if (auth === 'local' && this.localPassword) {
      headers.Authorization = `Bearer ${this.localPassword}`;
      headers['X-Local-Password'] = this.localPassword;
    }
  }

  protected async throwApiError(res: Response): Promise<never> {
    let payload: ApiErrorPayload | undefined;
    let message = `Request failed (${res.status})`;
    const text = await res.text();
    if (text) {
      try {
        payload = JSON.parse(text) as ApiErrorPayload;
      } catch {
        payload = { error: text };
      }
      message = this.extractErrorMessage(payload, message);
    }
    throw new APIError(message, res.status, payload ?? { error: message });
  }

  private extractErrorMessage(payload: ApiErrorPayload | JsonValue | undefined, fallback: string): string {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return fallback;
    const obj = payload as JsonObject;
    const error = obj.error;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && !Array.isArray(error)) {
      const nestedMessage = (error as JsonObject).message;
      if (typeof nestedMessage === 'string') return nestedMessage;
    }
    if (typeof obj.message === 'string') return obj.message;
    return fallback;
  }
}
