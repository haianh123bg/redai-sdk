export type SepayHubErrorCode =
  | "CONFIGURATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "VALIDATION_ERROR"
  | "API_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "UNEXPECTED_RESPONSE";

export interface SepayHubErrorOptions {
  code: SepayHubErrorCode;
  status?: number | undefined;
  operation?: string | undefined;
  details?: unknown;
  requestId?: string | undefined;
  retryable?: boolean | undefined;
  cause?: unknown;
}

export class SepayHubError extends Error {
  readonly code: SepayHubErrorCode;
  readonly status?: number | undefined;
  readonly operation?: string | undefined;
  readonly details?: unknown;
  readonly requestId?: string | undefined;
  readonly retryable?: boolean | undefined;

  constructor(message: string, options: SepayHubErrorOptions) {
    super(message);
    this.name = "SepayHubError";
    this.code = options.code;
    if (options.status !== undefined) {
      this.status = options.status;
    }
    if (options.operation !== undefined) {
      this.operation = options.operation;
    }
    this.details = options.details;
    if (options.requestId !== undefined) {
      this.requestId = options.requestId;
    }
    if (options.retryable !== undefined) {
      this.retryable = options.retryable;
    }

    if (options.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}
