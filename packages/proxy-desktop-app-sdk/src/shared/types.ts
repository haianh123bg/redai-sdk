export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | object | JsonArray | undefined;
export type JsonObject = Record<string, JsonValue>;
export type JsonArray = JsonValue[];

// Primary request types for sending messages (most commonly used)
export type PrimaryOpenAIChatRequest = OpenAIChatCompletionRequest;
export type PrimaryOpenAICompletionRequest = OpenAICompletionRequest;
export type PrimaryOpenAIResponsesRequest = OpenAIResponsesRequest;
export type PrimaryClaudeRequest = ClaudeMessagesRequest;
export type PrimaryGeminiRequest = GeminiGenerateContentRequest;
export type PrimaryCliproxyRequest = CliproxyChatRequest;

export interface OpenAIErrorDetail {
  message: string;
  type: string;
  code?: string;
}

export interface OpenAIErrorResponse {
  error: OpenAIErrorDetail;
}

export interface RootResponse {
  message: string;
  endpoints: string[];
}

export interface KeepAliveResponse {
  status: 'ok';
}

export interface DesktopKeysResponse {
  configPath: string;
  backendPath: string;
  baseUrl: string;
  bridgeUrl: string;
  apiKeys: string[];
  managementKey: string;
}

export interface DesktopRuntimeClientIdResponse {
  clientId: string;
}

export interface ManagementApiKeysResponse {
  'api-keys': string[];
  'management-key': string;
  'base-url'?: string;
  'bridge-url'?: string;
}

export interface ModelThinkingSupport {
  min?: number;
  max?: number;
  zero_allowed?: boolean;
  dynamic_allowed?: boolean;
  levels?: string[];
}

export interface ModelInfo {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  type: string;
  display_name?: string;
  name?: string;
  version?: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods?: string[];
  context_length?: number;
  max_completion_tokens?: number;
  supported_parameters?: string[];
  thinking?: ModelThinkingSupport;
}

export interface ModelListResponse {
  object: 'list';
  data: ModelInfo[];
}

export interface CliproxyModelsResponse {
  object: 'list';
  format: 'openai' | 'claude' | 'gemini' | 'generic';
  data: ModelInfo[];
}

export interface CliproxyAuthModelEntry {
  id: string;
  type?: string;
  display_name?: string;
  owned_by?: string;
}

export interface CliproxyAuthEntry {
  auth_id: string;
  provider: string;
  label?: string;
  status?: string;
  disabled?: boolean;
  unavailable?: boolean;
  models: CliproxyAuthModelEntry[];
}

export interface CliproxyAuthsResponse {
  object: 'list';
  data: CliproxyAuthEntry[];
}

export interface SDKConfig {
  'proxy-url'?: string;
  'force-model-prefix'?: boolean;
  'request-log'?: boolean;
  'api-keys'?: string[];
  auth?: AccessConfig;
  streaming?: StreamingConfig;
  'nonstream-keepalive-interval'?: number;
}

export interface StreamingConfig {
  'keepalive-seconds'?: number;
  'bootstrap-retries'?: number;
}

export interface AccessConfig {
  providers?: AccessProvider[];
}

export interface AccessProvider {
  name: string;
  type: string;
  sdk?: string;
  'api-keys'?: string[];
  config?: JsonObject;
}

export interface TLSConfig {
  enable: boolean;
  cert: string;
  key: string;
}

export interface PprofConfig {
  enable: boolean;
  addr: string;
}

export interface RemoteManagementConfig {
  'allow-remote'?: boolean;
  'secret-key'?: string;
  'disable-control-panel'?: boolean;
  'panel-github-repository'?: string;
}

export interface QuotaExceededConfig {
  'switch-project': boolean;
  'switch-preview-model': boolean;
}

export interface RoutingConfig {
  strategy?: string;
}

export interface OAuthModelAlias {
  name: string;
  alias: string;
  fork?: boolean;
}

export interface AmpModelMapping {
  from: string;
  to: string;
  regex?: boolean;
}

export interface AmpUpstreamAPIKeyEntry {
  'upstream-api-key': string;
  'api-keys': string[];
}

export interface AmpCodeConfig {
  'upstream-url': string;
  'upstream-api-key': string;
  'upstream-api-keys'?: AmpUpstreamAPIKeyEntry[];
  'restrict-management-to-localhost': boolean;
  'model-mappings': AmpModelMapping[];
  'force-model-mappings': boolean;
}

export interface PayloadConfig {
  default: PayloadRule[];
  'default-raw': PayloadRule[];
  override: PayloadRule[];
  'override-raw': PayloadRule[];
  filter: PayloadFilterRule[];
}

export interface PayloadFilterRule {
  models: PayloadModelRule[];
  params: string[];
}

export interface PayloadRule {
  models: PayloadModelRule[];
  params: JsonObject;
}

export interface PayloadModelRule {
  name: string;
  protocol: string;
}

export interface CloakConfig {
  mode?: string;
  'strict-mode'?: boolean;
  'sensitive-words'?: string[];
}

export interface ClaudeModel {
  name: string;
  alias: string;
}

export interface ClaudeKey {
  'api-key': string;
  priority?: number;
  prefix?: string;
  'base-url': string;
  'proxy-url': string;
  models: ClaudeModel[];
  headers?: Record<string, string>;
  'excluded-models'?: string[];
  cloak?: CloakConfig;
}

export interface CodexModel {
  name: string;
  alias: string;
}

export interface CodexKey {
  'api-key': string;
  priority?: number;
  prefix?: string;
  'base-url': string;
  'proxy-url': string;
  models: CodexModel[];
  headers?: Record<string, string>;
  'excluded-models'?: string[];
}

export interface GeminiModel {
  name: string;
  alias: string;
}

export interface GeminiKey {
  'api-key': string;
  priority?: number;
  prefix?: string;
  'base-url'?: string;
  'proxy-url'?: string;
  models?: GeminiModel[];
  headers?: Record<string, string>;
  'excluded-models'?: string[];
}

export interface OpenAICompatibilityAPIKey {
  'api-key': string;
  'proxy-url'?: string;
}

export interface OpenAICompatibilityModel {
  name: string;
  alias: string;
}

export interface OpenAICompatibility {
  name: string;
  priority?: number;
  prefix?: string;
  'base-url': string;
  'api-key-entries'?: OpenAICompatibilityAPIKey[];
  models: OpenAICompatibilityModel[];
  headers?: Record<string, string>;
}

export interface VertexCompatModel {
  name: string;
  alias: string;
}

export interface VertexCompatKey {
  'api-key': string;
  priority?: number;
  prefix?: string;
  'base-url'?: string;
  'proxy-url'?: string;
  headers?: Record<string, string>;
  models?: VertexCompatModel[];
}

export interface Config extends SDKConfig {
  tls: TLSConfig;
  debug: boolean;
  pprof: PprofConfig;
  'commercial-mode': boolean;
  'logging-to-file': boolean;
  'logs-max-total-size-mb': number;
  'error-logs-max-files': number;
  'usage-statistics-enabled': boolean;
  'disable-cooling': boolean;
  'request-retry': number;
  'max-retry-interval': number;
  'quota-exceeded': QuotaExceededConfig;
  routing: RoutingConfig;
  'ws-auth': boolean;
  'gemini-api-key': GeminiKey[];
  'codex-api-key': CodexKey[];
  'claude-api-key': ClaudeKey[];
  'openai-compatibility': OpenAICompatibility[];
  'vertex-api-key': VertexCompatKey[];
  ampcode: AmpCodeConfig;
  'oauth-excluded-models'?: Record<string, string[]>;
  'oauth-model-alias'?: Record<string, OAuthModelAlias[]>;
  payload: PayloadConfig;
}

export interface UsageTokenStats {
  input_tokens: number;
  output_tokens: number;
  reasoning_tokens: number;
  cached_tokens: number;
  total_tokens: number;
}

export interface UsageRequestDetail {
  timestamp: string;
  source: string;
  auth_index: string;
  tokens: UsageTokenStats;
  failed: boolean;
}

export interface UsageModelSnapshot {
  total_requests: number;
  total_tokens: number;
  details: UsageRequestDetail[];
}

export interface UsageApiSnapshot {
  total_requests: number;
  total_tokens: number;
  models: Record<string, UsageModelSnapshot>;
}

export interface UsageStatisticsSnapshot {
  total_requests: number;
  success_count: number;
  failure_count: number;
  total_tokens: number;
  apis: Record<string, UsageApiSnapshot>;
  requests_by_day: Record<string, number>;
  requests_by_hour: Record<string, number>;
  tokens_by_day: Record<string, number>;
  tokens_by_hour: Record<string, number>;
}

export interface UsageGetResponse {
  usage: UsageStatisticsSnapshot;
  failed_requests: number;
}

export interface UsageExportResponse {
  version: number;
  exported_at: string;
  usage: UsageStatisticsSnapshot;
}

export interface UsageImportRequest {
  version: number;
  usage: UsageStatisticsSnapshot;
}

export interface UsageImportResponse {
  added: number;
  skipped: number;
  total_requests: number;
  failed_requests: number;
}

export interface UpdateConnectionSettingsRequest {
  'base-url'?: string;
  baseUrl?: string;
  'access-api-key'?: string;
  accessApiKey?: string;
  'api-key'?: string;
  apiKey?: string;
  'management-key'?: string;
  managementKey?: string;
}

export interface ApiCallRequest {
  auth_index?: string;
  authIndex?: string;
  AuthIndex?: string;
  method: string;
  url: string;
  header: Record<string, string>;
  data: string;
}

export interface ApiCallResponse {
  status_code: number;
  header: Record<string, string[]>;
  body: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

export interface StatusResponse {
  status: 'ok' | 'error' | 'wait';
  error?: string;
  url?: string;
  state?: string;
  deleted?: number;
  disabled?: boolean;
}

export type KeyedValueResponse<K extends string, T> = { [P in K]: T };

export interface LogLinesResponse {
  lines: string[];
  'line-count': number;
  'latest-timestamp': number;
}

export interface DeleteLogsResponse {
  success: boolean;
  message: string;
  removed: number;
}

export interface ErrorLogFileInfo {
  name: string;
  size: number;
  modified: number;
}

export interface ErrorLogFilesResponse {
  files: ErrorLogFileInfo[];
}

export interface AuthFileEntry {
  id?: string;
  auth_index?: number;
  name?: string;
  type?: string;
  provider?: string;
  label?: string;
  status?: string;
  status_message?: string;
  disabled?: boolean;
  unavailable?: boolean;
  runtime_only?: boolean;
  source?: 'memory' | 'file';
  size?: number;
  email?: string;
  account_type?: string;
  account?: string;
  created_at?: string;
  modtime?: string;
  updated_at?: string;
  last_refresh?: string;
  path?: string;
  id_token?: JsonObject;
}

export interface AuthFileListResponse {
  files: AuthFileEntry[];
}

export interface AuthFileModelsResponse {
  models: CliproxyAuthModelEntry[];
}

export interface AuthFileUploadResponse {
  status: 'ok';
}

export interface AuthFileDeleteResponse {
  status: 'ok';
  deleted: number;
}

export interface AuthFileStatusRequest {
  name: string;
  disabled: boolean;
}

export interface AuthFileStatusResponse {
  status: 'ok';
  disabled: boolean;
}

export interface OAuthCallbackRequest {
  provider: string;
  redirect_url: string;
  code: string;
  state: string;
  error?: string;
}

export interface OAuthCallbackResponse {
  status: 'ok';
}

export interface OAuthStartResponse {
  status: 'ok';
  url: string;
  state: string;
}

export interface AuthStatusResponse {
  status: 'ok' | 'error' | 'wait';
  error?: string;
}

export interface AuthFileDownloadRequest {
  name: string;
}

export interface AuthFileListQuery {
  provider?: string;
}

export interface AuthFileModelsQuery {
  name: string;
}

export interface CliproxyAuthsQuery {
  provider?: string;
}

export interface CliproxyModelsQuery {
  format?: 'openai' | 'claude' | 'gemini' | 'generic';
}

export interface PatchStringListRequest {
  old?: string;
  new?: string;
  index?: number;
  value?: string;
}

export interface PatchByIndexOrMatch<TPatch> {
  index?: number;
  match?: string;
  value?: TPatch;
}

export interface GeminiKeyPatch {
  'api-key'?: string;
  prefix?: string;
  'base-url'?: string;
  'proxy-url'?: string;
  headers?: Record<string, string>;
  'excluded-models'?: string[];
}

export interface ClaudeKeyPatch {
  'api-key'?: string;
  prefix?: string;
  'base-url'?: string;
  'proxy-url'?: string;
  models?: ClaudeModel[];
  headers?: Record<string, string>;
  'excluded-models'?: string[];
}

export interface CodexKeyPatch {
  'api-key'?: string;
  prefix?: string;
  'base-url'?: string;
  'proxy-url'?: string;
  models?: CodexModel[];
  headers?: Record<string, string>;
  'excluded-models'?: string[];
}

export interface OpenAICompatPatch {
  name?: string;
  prefix?: string;
  'base-url'?: string;
  'api-key-entries'?: OpenAICompatibilityAPIKey[];
  models?: OpenAICompatibilityModel[];
  headers?: Record<string, string>;
}

export interface VertexCompatPatch {
  'api-key'?: string;
  prefix?: string;
  'base-url'?: string;
  'proxy-url'?: string;
  headers?: Record<string, string>;
  models?: VertexCompatModel[];
}

export interface OAuthExcludedModelsPatch {
  provider?: string;
  models: string[];
}

export interface OAuthModelAliasPatch {
  provider?: string;
  channel?: string;
  aliases: OAuthModelAlias[];
}

export interface AmpModelMappingsPatch {
  value: AmpModelMapping[];
}

export interface AmpUpstreamAPIKeysPatch {
  value: AmpUpstreamAPIKeyEntry[];
}

export interface AmpStringListPatch {
  value: string[];
}

export interface AuthFileUploadRequest {
  file: Blob;
  name?: string;
}

export interface VertexImportRequest {
  file: Blob;
}

// OpenAI-compatible (Chat Completions / Completions / Responses)
export type OpenAIChatRole = 'system' | 'user' | 'assistant' | 'tool' | 'developer';

export interface OpenAIChatMessageContentText {
  type: 'text';
  text: string;
}

export interface OpenAIChatMessageContentImageUrl {
  type: 'image_url';
  image_url: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

export type OpenAIChatMessageContentPart = OpenAIChatMessageContentText | OpenAIChatMessageContentImageUrl;

export interface OpenAIChatMessage {
  role: OpenAIChatRole;
  content: string | OpenAIChatMessageContentPart[];
  name?: string;
  tool_call_id?: string;
  tool_calls?: JsonArray;
}

export interface OpenAIChatCompletionRequest extends JsonObject {
  model: string;
  messages: OpenAIChatMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string | string[];
  tools?: JsonArray;
  tool_choice?: JsonValue;
  response_format?: JsonObject;
}

export interface OpenAICompletionRequest extends JsonObject {
  model: string;
  prompt: string | string[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string | string[];
}

export interface OpenAIResponsesInputText {
  type: 'input_text';
  text: string;
}

export interface OpenAIResponsesInputImage {
  type: 'input_image';
  image_url: string;
}

export type OpenAIResponsesInputContent = OpenAIResponsesInputText | OpenAIResponsesInputImage;

export interface OpenAIResponsesInputMessage {
  role: 'system' | 'user' | 'assistant' | 'developer';
  content: string | OpenAIResponsesInputContent[];
}

export interface OpenAIResponsesRequest extends JsonObject {
  model: string;
  input: string | OpenAIResponsesInputMessage[] | OpenAIResponsesInputContent[];
  stream?: boolean;
  max_output_tokens?: number;
  temperature?: number;
  top_p?: number;
  tools?: JsonArray;
  tool_choice?: JsonValue;
}

export type OpenAICompatibleRequest = OpenAIChatCompletionRequest | OpenAICompletionRequest | OpenAIResponsesRequest | JsonObject;

export interface OpenAIChatCompletionChoice {
  index: number;
  message: OpenAIChatMessage;
  finish_reason?: string | null;
}

export interface OpenAIChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: OpenAIChatCompletionChoice[];
  usage?: JsonObject;
}

export interface OpenAIChatCompletionChunkChoice {
  index: number;
  delta: Partial<OpenAIChatMessage>;
  finish_reason?: string | null;
}

export interface OpenAIChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: OpenAIChatCompletionChunkChoice[];
}

export interface OpenAICompletionChoice {
  index: number;
  text: string;
  finish_reason?: string | null;
  logprobs?: JsonValue;
}

export interface OpenAICompletionResponse {
  id: string;
  object: 'text_completion';
  created: number;
  model: string;
  choices: OpenAICompletionChoice[];
  usage?: JsonObject;
}

export interface OpenAICompletionChunk {
  id: string;
  object: 'text_completion';
  created: number;
  model: string;
  choices: OpenAICompletionChoice[];
}

export interface OpenAIResponsesOutput {
  type: string;
  id?: string;
  role?: string;
  content?: JsonArray;
  annotations?: JsonArray;
}

export interface OpenAIResponsesResponse {
  id: string;
  object: 'response';
  created: number;
  model: string;
  output: OpenAIResponsesOutput[];
  usage?: JsonObject;
}

export interface OpenAIResponsesChunk {
  id: string;
  object: 'response.chunk';
  created: number;
  model: string;
  output?: OpenAIResponsesOutput[];
}

export type OpenAICompatibleResponse =
  | OpenAIChatCompletionResponse
  | OpenAIChatCompletionChunk
  | OpenAICompletionResponse
  | OpenAICompletionChunk
  | OpenAIResponsesResponse
  | OpenAIResponsesChunk
  | JsonObject;

// CLIProxy simplified chat payload
export interface CliproxyChatRequest extends JsonObject {
  model: string;
  auth_id?: string;
  authId?: string;
  messages?: OpenAIChatMessage[] | JsonArray;
  input?: string;
  prompt?: string;
  system?: string;
  stream?: boolean;
}

// Claude-compatible (/v1/messages)
export type ClaudeMessageRole = 'user' | 'assistant';

export interface ClaudeContentText {
  type: 'text';
  text: string;
}

export interface ClaudeContentImage {
  type: 'image';
  source: {
    type: 'base64' | 'url';
    media_type?: string;
    data?: string;
    url?: string;
  };
}

export type ClaudeContentBlock = ClaudeContentText | ClaudeContentImage;

export interface ClaudeMessage {
  role: ClaudeMessageRole;
  content: string | ClaudeContentBlock[];
}

export interface ClaudeMessagesRequest extends JsonObject {
  model: string;
  messages: ClaudeMessage[];
  system?: string | ClaudeContentBlock[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stream?: boolean;
  stop_sequences?: string[];
  tools?: JsonArray;
}

export interface ClaudeCompatibleRequest extends ClaudeMessagesRequest {}

export interface ClaudeUsage {
  input_tokens?: number;
  output_tokens?: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
}

export interface ClaudeMessagesResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: ClaudeContentBlock[];
  model: string;
  stop_reason?: string | null;
  stop_sequence?: string | null;
  usage?: ClaudeUsage;
}

export type ClaudeStreamEventType =
  | 'message_start'
  | 'content_block_start'
  | 'content_block_delta'
  | 'content_block_stop'
  | 'message_delta'
  | 'message_stop';

export interface ClaudeStreamEvent {
  type: ClaudeStreamEventType;
  message?: ClaudeMessagesResponse;
  index?: number;
  delta?: JsonObject;
  usage?: ClaudeUsage;
}

export type ClaudeCompatibleResponse = ClaudeMessagesResponse | ClaudeStreamEvent | JsonObject;

// Gemini-compatible (/v1beta)
export interface GeminiInlineData {
  mime_type?: string;
  data?: string;
}

export interface GeminiFunctionCall {
  id?: string;
  name: string;
  args: JsonObject;
}

export interface GeminiFunctionResponse {
  id?: string;
  name: string;
  response: JsonObject;
}

export interface GeminiPart {
  thought?: boolean;
  text?: string;
  inlineData?: GeminiInlineData;
  thoughtSignature?: string;
  functionCall?: GeminiFunctionCall;
  functionResponse?: GeminiFunctionResponse;
}

export interface GeminiContent {
  role: 'user' | 'model' | 'tool';
  parts: GeminiPart[];
}

export interface GeminiGenerationConfig {
  thinkingConfig?: { include_thoughts?: boolean };
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiToolDeclaration {
  functionDeclarations: JsonArray;
}

export interface GeminiGenerateContentRequest extends JsonObject {
  systemInstruction?: GeminiContent;
  contents: GeminiContent[];
  tools?: GeminiToolDeclaration[];
  generationConfig?: GeminiGenerationConfig;
}

export interface GeminiCompatibleRequest extends GeminiGenerateContentRequest {}

export interface GeminiCandidate {
  content?: GeminiContent;
  finishReason?: string;
  index?: number;
  safetyRatings?: JsonArray;
}

export interface GeminiPromptFeedback {
  safetyRatings?: JsonArray;
}

export interface GeminiGenerateContentResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
}

export interface GeminiStreamChunk {
  candidates?: GeminiCandidate[];
  promptFeedback?: GeminiPromptFeedback;
}

export type GeminiCompatibleResponse = GeminiGenerateContentResponse | GeminiStreamChunk | JsonObject;
