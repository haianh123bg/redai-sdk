import type { ErrorResponse, JsonObject, JsonValue, OpenAIErrorResponse, StatusResponse } from './types.js';

export type ManagementErrorResponse = ErrorResponse;

export type ApiErrorPayload =
  | OpenAIErrorResponse
  | ManagementErrorResponse
  | StatusResponse
  | JsonObject
  | { error: string };

export class APIError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.payload = payload;
  }
}

function isJsonObject(payload: JsonValue | undefined): payload is JsonObject {
  return !!payload && typeof payload === 'object' && !Array.isArray(payload);
}

export function isOpenAIError(payload: JsonValue | undefined): payload is OpenAIErrorResponse {
  if (!isJsonObject(payload)) return false;
  const error = payload.error;
  if (!error || typeof error !== 'object' || Array.isArray(error)) return false;
  const message = (error as JsonObject).message;
  const type = (error as JsonObject).type;
  return typeof message === 'string' && typeof type === 'string';
}

export function isStatusError(payload: JsonValue | undefined): payload is StatusResponse {
  if (!isJsonObject(payload)) return false;
  const status = payload.status;
  return typeof status === 'string' && (status === 'error' || status === 'wait' || status === 'ok');
}

export function isManagementError(payload: JsonValue | undefined): payload is ManagementErrorResponse {
  if (!isJsonObject(payload)) return false;
  return typeof payload.error === 'string';
}
