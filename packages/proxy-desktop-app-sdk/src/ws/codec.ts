import type {
  HTTPRequest,
  HTTPResponse,
  WSErrorPayload,
  WSHeaders,
  WSHttpRequestPayload,
  WSHttpResponsePayload,
  WSStreamChunkPayload
} from './types.js';

// Decode a server->provider request payload into an HTTPRequest.
// Mirrors CLIProxyAPI wsrelay encodeRequest behavior.
export function decodeRequest(payload?: WSHttpRequestPayload): HTTPRequest {
  const method = typeof payload?.method === 'string' ? payload.method : 'GET';
  const url = typeof payload?.url === 'string' ? payload.url : '';
  const rawHeaders = payload?.headers;
  const headers: WSHeaders = {};
  if (rawHeaders) {
    for (const [key, raw] of Object.entries(rawHeaders)) {
      if (Array.isArray(raw)) {
        headers[key] = raw.map(String);
      } else if (typeof raw === 'string') {
        headers[key] = [raw];
      }
    }
  }
  const body = typeof payload?.body === 'string' ? payload.body : '';
  const sent_at = typeof payload?.sent_at === 'string' ? payload.sent_at : undefined;
  return { method, url, headers, body, sent_at };
}

// Encode a provider response into the wsrelay HTTP response payload.
export function encodeResponse(resp: HTTPResponse): WSHttpResponsePayload {
  const headers: Record<string, string[]> = {};
  if (resp.headers) {
    for (const [key, value] of Object.entries(resp.headers)) {
      if (Array.isArray(value)) headers[key] = value.map(String);
      else headers[key] = [String(value)];
    }
  }
  return {
    status: resp.status ?? 200,
    headers,
    body: resp.body ?? ''
  };
}

// Decode a wsrelay HTTP response payload into HTTPResponse.
// CLIProxyAPI defaults to 502 when payload is missing.
export function decodeResponse(payload?: WSHttpResponsePayload): HTTPResponse {
  let status: number;
  if (!payload) {
    status = 502;
  } else if (typeof payload.status === 'number') {
    status = payload.status;
  } else if (typeof payload.status === 'string') {
    const parsed = Number(payload.status);
    status = Number.isFinite(parsed) ? parsed : 200;
  } else {
    status = 200;
  }

  const headers: Record<string, string | string[]> = {};
  const rawHeaders = payload?.headers;
  if (rawHeaders) {
    for (const [key, raw] of Object.entries(rawHeaders)) {
      if (Array.isArray(raw)) {
        headers[key] = raw.map(String);
      } else if (typeof raw === 'string') {
        headers[key] = raw;
      }
    }
  }

  const body = typeof payload?.body === 'string' ? payload.body : '';
  return { status, headers, body };
}

// Encode a streaming chunk message payload.
export function encodeChunk(chunk: string): WSStreamChunkPayload {
  return { data: chunk ?? '' };
}

// Decode a streaming chunk message payload.
export function decodeChunk(payload?: WSStreamChunkPayload): string {
  const data = payload?.data;
  return typeof data === 'string' ? data : '';
}

// Encode an error payload. Status is optional but preferred when known.
export function encodeError(message: string, status?: number): WSErrorPayload {
  const payload: WSErrorPayload = { error: message || 'wsrelay: upstream error' };
  if (typeof status === 'number' && !Number.isNaN(status)) {
    payload.status = status;
  }
  return payload;
}

// Decode an error payload into a human-readable message.
// CLIProxyAPI always formats as "message (status=...)".
export function decodeError(payload?: WSErrorPayload): string {
  if (!payload) return 'wsrelay: upstream error';
  const message = typeof payload.error === 'string' ? payload.error : 'wsrelay: upstream error';
  const status = typeof payload.status === 'number'
    ? payload.status
    : typeof payload.status === 'string'
      ? Number(payload.status)
      : 0;
  return `${message} (status=${Number.isFinite(status) ? status : 0})`;
}
