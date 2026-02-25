export interface FrontendSdkConfig {
  apiBaseUrl: string;
  accessToken?: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
}

export class FrontendSdkClient {
  private readonly config: FrontendSdkConfig;

  constructor(config: FrontendSdkConfig) {
    this.config = config;
  }

  getConfig(): FrontendSdkConfig {
    return { ...this.config };
  }

  buildHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      ...(this.config.defaultHeaders ?? {}),
      ...(extraHeaders ?? {})
    };

    if (this.config.accessToken) {
      headers.Authorization = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }
}
