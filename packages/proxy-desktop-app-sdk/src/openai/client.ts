import type { RequestOptions } from '../shared/http.js';
import { BaseHttpClient } from '../shared/http.js';
import type {
  ModelListResponse,
  OpenAIChatCompletionRequest,
  OpenAICompletionRequest,
  OpenAIResponsesRequest
} from '../shared/types.js';

export class OpenAIClient extends BaseHttpClient {
  // GET /v1/models (OpenAI or Claude depending on User-Agent)
  getModels(options?: RequestOptions) {
    return this.requestJson<ModelListResponse>('GET', '/v1/models', undefined, options, 'access');
  }

  // POST /v1/chat/completions
  postChatCompletions(body: OpenAIChatCompletionRequest, options?: RequestOptions) {
    return this.requestRaw('POST', '/v1/chat/completions', JSON.stringify(body), options, 'access');
  }

  // POST /v1/completions
  postCompletions(body: OpenAICompletionRequest, options?: RequestOptions) {
    return this.requestRaw('POST', '/v1/completions', JSON.stringify(body), options, 'access');
  }

  // POST /v1/responses
  postResponses(body: OpenAIResponsesRequest, options?: RequestOptions) {
    return this.requestRaw('POST', '/v1/responses', JSON.stringify(body), options, 'access');
  }

  // POST /v1/responses/compact
  postResponsesCompact(body: OpenAIResponsesRequest, options?: RequestOptions) {
    return this.requestRaw('POST', '/v1/responses/compact', JSON.stringify(body), options, 'access');
  }
}
