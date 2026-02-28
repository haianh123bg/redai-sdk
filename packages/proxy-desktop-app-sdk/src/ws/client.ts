import WebSocket from 'ws';
import { decodeRequest, encodeChunk, encodeError, encodeResponse } from './codec.js';
import type {
  HTTPHeaders,
  HTTPRequest,
  HTTPResponse,
  ProviderEvent,
  ProviderOptions,
  WSMessage,
  WSRequestContext
} from './types.js';

export interface ProviderHandlers {
  onRequest: (req: HTTPRequest, ctx: WSRequestContext) => void | Promise<void>;
  onEvent?: (ev: ProviderEvent) => void;
}

// CliproxyWSProvider connects to CLIProxyAPI /v1/ws and handles server->provider requests.
// The websocket message shapes match CLIProxyAPI internal/wsrelay Message definitions.
export class CliproxyWSProvider {
  private ws?: WebSocket;
  private options: ProviderOptions;
  private handlers?: ProviderHandlers;

  constructor(options: ProviderOptions) {
    this.options = options;
  }

  // connect opens the websocket and starts processing incoming requests.
  // It resolves once the socket is open.
  connect(handlers: ProviderHandlers): Promise<void> {
    this.handlers = handlers;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
    const base = this.options.baseUrl.replace(/\/+$/, '');
    const url = `${base.replace(/^http/, 'ws')}/v1/ws`;
    const headers: Record<string, string> = { ...(this.options.headers ?? {}) };
    if (this.options.accessKey) headers['Authorization'] = `Bearer ${this.options.accessKey}`;
    if (this.options.managementKey) headers['X-Management-Key'] = this.options.managementKey;
    if (this.options.providerName) {
      headers['X-Provider-Name'] = this.options.providerName;
      headers['X-Provider'] = this.options.providerName;
    }

    this.ws = new WebSocket(url, { headers });

    return new Promise((resolve, reject) => {
      const ws = this.ws!;
      const onOpen = () => {
        this.handlers?.onEvent?.({ type: 'ws:open' });
        resolve();
      };
      const onErr = (err: Error) => {
        this.emitError(err?.message ?? 'wsrelay: connect error');
        reject(err);
      };
      ws.once('open', onOpen);
      ws.once('error', onErr);
      ws.on('message', (raw) => this.handleMessage(raw.toString()));
      ws.on('error', (err) => this.emitError(err?.message ?? 'wsrelay: socket error'));
      ws.on('close', (code, reason) => this.handleClose(code, reason.toString()));
    });
  }

  close() {
    this.ws?.close();
  }

  private handleMessage(raw: string) {
    let msg: WSMessage | undefined;
    try {
      msg = JSON.parse(raw) as WSMessage;
    } catch {
      this.emitError('wsrelay: invalid message (json parse failed)');
      return;
    }
    if (!msg || !msg.id || !msg.type) {
      this.emitError('wsrelay: invalid message (missing id/type)');
      return;
    }

    if (msg.type === 'ping') {
      this.sendMessage('pong', msg.id);
      return;
    }

    if (msg.type !== 'http_request') return;

    const req = decodeRequest(msg.payload);
    const ctx = this.buildContext(msg.id);
    this.handlers?.onEvent?.({ type: 'request', requestId: msg.id, request: req });
    Promise.resolve()
      .then(() => this.handlers?.onRequest(req, ctx))
      .catch((err: Error | { message?: string } | string | null | undefined) => {
        const message = this.errorMessage(err);
        ctx.error(message);
        this.emitError(message, msg.id);
      });
  }

  private errorMessage(err: Error | { message?: string } | string | null | undefined): string {
    if (typeof err === 'string' && err) return err;
    if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' && err.message) {
      return err.message;
    }
    if (err instanceof Error && err.message) return err.message;
    return 'provider error';
  }

  private handleClose(code?: number, reason?: string) {
    this.handlers?.onEvent?.({ type: 'ws:close', code, reason });
  }

  private emitError(error: string, requestId?: string) {
    this.handlers?.onEvent?.({ type: 'error', requestId, error });
  }

  private buildContext(requestId: string): WSRequestContext {
    return {
      requestId,
      respond: (resp: HTTPResponse) => {
        this.sendMessage('http_response', requestId, encodeResponse(resp));
      },
      streamStart: (status?: number, headers?: HTTPHeaders) => {
        const payload = encodeResponse({ status: status ?? 200, headers, body: '' });
        this.sendMessage('stream_start', requestId, payload);
      },
      streamChunk: (chunk: string) => {
        this.sendMessage('stream_chunk', requestId, encodeChunk(chunk));
      },
      streamEnd: () => {
        this.sendMessage('stream_end', requestId);
      },
      error: (message: string, status?: number) => {
        this.sendMessage('error', requestId, encodeError(message, status));
      }
    };
  }

  private sendMessage(type: 'ping' | 'pong' | 'stream_end', id: string): void;
  private sendMessage<T extends Exclude<WSMessage['type'], 'ping' | 'pong' | 'stream_end'>>(
    type: T,
    id: string,
    payload: Extract<WSMessage, { type: T }>['payload']
  ): void;
  private sendMessage(type: WSMessage['type'], id: string, payload?: WSMessage['payload']) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const msg = (payload === undefined ? { id, type } : { id, type, payload }) as WSMessage;
    this.ws.send(JSON.stringify(msg));
  }
}

export class CliproxyWSClient extends CliproxyWSProvider {}
