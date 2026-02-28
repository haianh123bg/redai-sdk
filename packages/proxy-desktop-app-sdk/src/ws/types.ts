// HTTP headers used in provider code (string or string[]).
export type HTTPHeaders = Record<string, string | string[]>;
// Websocket payload headers are normalized to string arrays.
export type WSHeaders = Record<string, string[]>;

// HTTPRequest matches CLIProxyAPI wsrelay request payload.
export interface HTTPRequest {
  method: string;
  url: string;
  headers?: WSHeaders;
  body?: string;
  sent_at?: string;
}

// HTTPResponse represents provider replies over wsrelay.
export interface HTTPResponse {
  status: number;
  headers?: HTTPHeaders;
  body?: string;
}

// WSHttpRequestPayload is the raw websocket payload for a request.
export interface WSHttpRequestPayload {
  method: string;
  url: string;
  headers?: Record<string, string | string[]>;
  body?: string;
  sent_at?: string;
}

// WSHttpResponsePayload is the raw websocket payload for a response.
export interface WSHttpResponsePayload {
  status: number | string;
  headers?: Record<string, string | string[]>;
  body?: string;
}

// WSStreamChunkPayload carries streaming chunk text.
export interface WSStreamChunkPayload {
  data: string;
}

// WSErrorPayload is the error payload returned to CLIProxyAPI.
export interface WSErrorPayload {
  error: string;
  status?: number | string;
}

// WSHttpRequestMessage is sent from server to provider.
export interface WSHttpRequestMessage {
  id: string;
  type: 'http_request';
  payload: WSHttpRequestPayload;
}

// WSHttpResponseMessage is sent from provider to server (non-streaming).
export interface WSHttpResponseMessage {
  id: string;
  type: 'http_response';
  payload: WSHttpResponsePayload;
}

// WSStreamStartMessage is sent from provider to server to start stream.
export interface WSStreamStartMessage {
  id: string;
  type: 'stream_start';
  payload: WSHttpResponsePayload;
}

// WSStreamChunkMessage is sent from provider to server for each chunk.
export interface WSStreamChunkMessage {
  id: string;
  type: 'stream_chunk';
  payload: WSStreamChunkPayload;
}

// WSStreamEndMessage is sent from provider to server to end stream.
export interface WSStreamEndMessage {
  id: string;
  type: 'stream_end';
  payload?: undefined;
}

// WSErrorMessage is sent from provider to server on error.
export interface WSErrorMessage {
  id: string;
  type: 'error';
  payload: WSErrorPayload;
}

// WSPingMessage is an app-level ping (not WS control frame).
export interface WSPingMessage {
  id: string;
  type: 'ping';
  payload?: undefined;
}

// WSPongMessage is an app-level pong response.
export interface WSPongMessage {
  id: string;
  type: 'pong';
  payload?: undefined;
}

export type WSMessage =
  | WSHttpRequestMessage
  | WSHttpResponseMessage
  | WSStreamStartMessage
  | WSStreamChunkMessage
  | WSStreamEndMessage
  | WSErrorMessage
  | WSPingMessage
  | WSPongMessage;

export interface ProviderOptions {
  baseUrl: string; // e.g. http://127.0.0.1:8317
  accessKey?: string; // Bearer token if ws-auth enabled
  managementKey?: string; // Optional management key propagated to wsrelay session
  providerName?: string; // Optional logical provider/channel name (server-dependent)
  headers?: Record<string, string>; // Extra headers for websocket upgrade
}
export type ProviderEvent =
  | { type: 'error'; requestId?: string; error: string }
  | { type: 'ws:open' }
  | { type: 'ws:close'; code?: number; reason?: string }
  | { type: 'request'; requestId: string; request: HTTPRequest };

// WSRequestContext exposes helpers for replying to server requests.
export interface WSRequestContext {
  requestId: string;
  respond: (resp: HTTPResponse) => void;
  streamStart: (status?: number, headers?: HTTPHeaders) => void;
  streamChunk: (chunk: string) => void;
  streamEnd: () => void;
  error: (message: string, status?: number) => void;
}
