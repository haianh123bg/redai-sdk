import { BaseHttpClient } from '../shared/http.js';
import type {
  AmpModelMapping,
  AmpModelMappingsPatch,
  AmpUpstreamAPIKeyEntry,
  AmpUpstreamAPIKeysPatch,
  ApiCallRequest,
  ApiCallResponse,
  AuthFileDeleteResponse,
  AuthFileListQuery,
  AuthFileListResponse,
  AuthFileModelsQuery,
  AuthFileModelsResponse,
  AuthFileStatusRequest,
  AuthFileStatusResponse,
  AuthStatusResponse,
  ClaudeKey,
  ClaudeKeyPatch,
  CodexKey,
  CodexKeyPatch,
  Config,
  DeleteLogsResponse,
  DesktopKeysResponse,
  DesktopRuntimeClientIdResponse,
  ErrorLogFilesResponse,
  GeminiKey,
  GeminiKeyPatch,
  KeyedValueResponse,
  LogLinesResponse,
  ManagementApiKeysResponse,
  OAuthCallbackRequest,
  OAuthCallbackResponse,
  OAuthExcludedModelsPatch,
  OAuthModelAlias,
  OAuthModelAliasPatch,
  OAuthStartResponse,
  OpenAICompatibility,
  OpenAICompatPatch,
  PatchByIndexOrMatch,
  PatchStringListRequest,
  UpdateConnectionSettingsRequest,
  UsageExportResponse,
  UsageGetResponse,
  UsageImportRequest,
  UsageImportResponse,
  VertexCompatKey,
  VertexCompatPatch
} from '../shared/types.js';

export class ManagementClient extends BaseHttpClient {
  getDesktopKeys() {
    return this.requestJson<DesktopKeysResponse>('GET', '/desktop/keys');
  }

  getRuntimeClientId() {
    return this.requestJson<DesktopRuntimeClientIdResponse>('GET', '/desktop/runtime-client-id');
  }

  async getManagementApiKeys() {
    try {
      const data = await this.getDesktopKeys();
      return {
        'api-keys': Array.isArray(data?.apiKeys) ? data.apiKeys : [],
        'management-key': data?.managementKey ?? this.managementKey ?? '',
        'base-url': data?.baseUrl,
        'bridge-url': data?.bridgeUrl,
      } as ManagementApiKeysResponse;
    } catch {
      const data = await this.getApiKeys();
      return {
        'api-keys': Array.isArray(data?.['api-keys']) ? data['api-keys'] : [],
        'management-key': this.managementKey ?? '',
      } as ManagementApiKeysResponse;
    }
  }

  getUsage() {
    return this.requestJson<UsageGetResponse>('GET', '/v0/management/usage', undefined, undefined, 'management');
  }

  exportUsage() {
    return this.requestJson<UsageExportResponse>('GET', '/v0/management/usage/export', undefined, undefined, 'management');
  }

  importUsage(body: UsageImportRequest) {
    return this.requestJson<UsageImportResponse>('POST', '/v0/management/usage/import', body, undefined, 'management');
  }

  getConfig() {
    return this.requestJson<Config>('GET', '/v0/management/config', undefined, undefined, 'management');
  }

  getConfigYaml() {
    return this.requestText('GET', '/v0/management/config.yaml', undefined, undefined, 'management');
  }

  putConfigYaml(body: string) {
    return this.requestRaw('PUT', '/v0/management/config.yaml', body, { headers: { 'Content-Type': 'text/yaml' } }, 'management').then(async (res) => {
      const text = await res.text();
      return text ? (JSON.parse(text) as KeyedValueResponse<'status', 'ok'>) : ({ status: 'ok' } as KeyedValueResponse<'status', 'ok'>);
    });
  }

  putConnectionSettings(body: UpdateConnectionSettingsRequest) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PUT',
      '/v0/management/connection-settings',
      body,
      undefined,
      'management'
    );
  }

  getLatestVersion() {
    return this.requestJson<KeyedValueResponse<'latest-version', string>>('GET', '/v0/management/latest-version', undefined, undefined, 'management');
  }

  getDebug() {
    return this.requestJson<KeyedValueResponse<'debug', boolean>>('GET', '/v0/management/debug', undefined, undefined, 'management');
  }

  putDebug(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/debug', body, undefined, 'management');
  }

  patchDebug(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/debug', body, undefined, 'management');
  }

  getLoggingToFile() {
    return this.requestJson<KeyedValueResponse<'logging-to-file', boolean>>('GET', '/v0/management/logging-to-file', undefined, undefined, 'management');
  }

  putLoggingToFile(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/logging-to-file', body, undefined, 'management');
  }

  patchLoggingToFile(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/logging-to-file', body, undefined, 'management');
  }

  getLogsMaxTotalSizeMB() {
    return this.requestJson<KeyedValueResponse<'logs-max-total-size-mb', number>>('GET', '/v0/management/logs-max-total-size-mb', undefined, undefined, 'management');
  }

  putLogsMaxTotalSizeMB(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/logs-max-total-size-mb', body, undefined, 'management');
  }

  patchLogsMaxTotalSizeMB(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/logs-max-total-size-mb', body, undefined, 'management');
  }

  getErrorLogsMaxFiles() {
    return this.requestJson<KeyedValueResponse<'error-logs-max-files', number>>('GET', '/v0/management/error-logs-max-files', undefined, undefined, 'management');
  }

  putErrorLogsMaxFiles(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/error-logs-max-files', body, undefined, 'management');
  }

  patchErrorLogsMaxFiles(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/error-logs-max-files', body, undefined, 'management');
  }

  getUsageStatisticsEnabled() {
    return this.requestJson<KeyedValueResponse<'usage-statistics-enabled', boolean>>('GET', '/v0/management/usage-statistics-enabled', undefined, undefined, 'management');
  }

  putUsageStatisticsEnabled(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/usage-statistics-enabled', body, undefined, 'management');
  }

  patchUsageStatisticsEnabled(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/usage-statistics-enabled', body, undefined, 'management');
  }

  getProxyUrl() {
    return this.requestJson<KeyedValueResponse<'proxy-url', string>>('GET', '/v0/management/proxy-url', undefined, undefined, 'management');
  }

  putProxyUrl(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/proxy-url', body, undefined, 'management');
  }

  patchProxyUrl(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/proxy-url', body, undefined, 'management');
  }

  deleteProxyUrl() {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/proxy-url', undefined, undefined, 'management');
  }

  apiCall(body: ApiCallRequest) {
    return this.requestJson<ApiCallResponse>('POST', '/v0/management/api-call', body, undefined, 'management');
  }

  getSwitchProject() {
    return this.requestJson<KeyedValueResponse<'switch-project', boolean>>('GET', '/v0/management/quota-exceeded/switch-project', undefined, undefined, 'management');
  }

  putSwitchProject(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/quota-exceeded/switch-project', body, undefined, 'management');
  }

  patchSwitchProject(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/quota-exceeded/switch-project', body, undefined, 'management');
  }

  getSwitchPreviewModel() {
    return this.requestJson<KeyedValueResponse<'switch-preview-model', boolean>>('GET', '/v0/management/quota-exceeded/switch-preview-model', undefined, undefined, 'management');
  }

  putSwitchPreviewModel(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/quota-exceeded/switch-preview-model', body, undefined, 'management');
  }

  patchSwitchPreviewModel(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/quota-exceeded/switch-preview-model', body, undefined, 'management');
  }

  getApiKeys() {
    return this.requestJson<KeyedValueResponse<'api-keys', string[]>>('GET', '/v0/management/api-keys', undefined, undefined, 'management');
  }

  putApiKeys(body: string[] | { items: string[] }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/api-keys', body, undefined, 'management');
  }

  patchApiKeys(body: PatchStringListRequest) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/api-keys', body, undefined, 'management');
  }

  deleteApiKeys(query?: { index?: number; value?: string }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/api-keys', undefined, { query }, 'management');
  }

  getGeminiKeys() {
    return this.requestJson<KeyedValueResponse<'gemini-api-key', GeminiKey[]>>('GET', '/v0/management/gemini-api-key', undefined, undefined, 'management');
  }

  putGeminiKeys(body: GeminiKey[] | { items: GeminiKey[] }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/gemini-api-key', body, undefined, 'management');
  }

  patchGeminiKey(body: PatchByIndexOrMatch<GeminiKeyPatch>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/gemini-api-key', body, undefined, 'management');
  }

  deleteGeminiKey(query?: { 'api-key'?: string; index?: number }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/gemini-api-key', undefined, { query }, 'management');
  }

  getLogs(query?: { limit?: number; after?: number }) {
    return this.requestJson<LogLinesResponse>('GET', '/v0/management/logs', undefined, { query }, 'management');
  }

  deleteLogs() {
    return this.requestJson<DeleteLogsResponse>('DELETE', '/v0/management/logs', undefined, undefined, 'management');
  }

  getRequestErrorLogs() {
    return this.requestJson<ErrorLogFilesResponse>('GET', '/v0/management/request-error-logs', undefined, undefined, 'management');
  }

  downloadRequestErrorLog(name: string) {
    return this.requestRaw('GET', `/v0/management/request-error-logs/${encodeURIComponent(name)}`, undefined, undefined, 'management');
  }

  getRequestLogById(id: string) {
    return this.requestRaw('GET', `/v0/management/request-log-by-id/${encodeURIComponent(id)}`, undefined, undefined, 'management');
  }

  getRequestLog() {
    return this.requestJson<KeyedValueResponse<'request-log', boolean>>('GET', '/v0/management/request-log', undefined, undefined, 'management');
  }

  putRequestLog(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/request-log', body, undefined, 'management');
  }

  patchRequestLog(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/request-log', body, undefined, 'management');
  }

  getWebsocketAuth() {
    return this.requestJson<KeyedValueResponse<'ws-auth', boolean>>('GET', '/v0/management/ws-auth', undefined, undefined, 'management');
  }

  putWebsocketAuth(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/ws-auth', body, undefined, 'management');
  }

  patchWebsocketAuth(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/ws-auth', body, undefined, 'management');
  }

  getAmpCode() {
    return this.requestJson<KeyedValueResponse<'ampcode', Config['ampcode']>>('GET', '/v0/management/ampcode', undefined, undefined, 'management');
  }

  getAmpUpstreamUrl() {
    return this.requestJson<KeyedValueResponse<'upstream-url', string>>('GET', '/v0/management/ampcode/upstream-url', undefined, undefined, 'management');
  }

  putAmpUpstreamUrl(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/ampcode/upstream-url', body, undefined, 'management');
  }

  patchAmpUpstreamUrl(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/ampcode/upstream-url', body, undefined, 'management');
  }

  deleteAmpUpstreamUrl() {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/ampcode/upstream-url', undefined, undefined, 'management');
  }

  getAmpUpstreamApiKey() {
    return this.requestJson<KeyedValueResponse<'upstream-api-key', string>>('GET', '/v0/management/ampcode/upstream-api-key', undefined, undefined, 'management');
  }

  putAmpUpstreamApiKey(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/ampcode/upstream-api-key', body, undefined, 'management');
  }

  patchAmpUpstreamApiKey(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/ampcode/upstream-api-key', body, undefined, 'management');
  }

  deleteAmpUpstreamApiKey() {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/ampcode/upstream-api-key', undefined, undefined, 'management');
  }

  getAmpRestrictManagementToLocalhost() {
    return this.requestJson<KeyedValueResponse<'restrict-management-to-localhost', boolean>>(
      'GET',
      '/v0/management/ampcode/restrict-management-to-localhost',
      undefined,
      undefined,
      'management'
    );
  }

  putAmpRestrictManagementToLocalhost(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PUT',
      '/v0/management/ampcode/restrict-management-to-localhost',
      body,
      undefined,
      'management'
    );
  }

  patchAmpRestrictManagementToLocalhost(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PATCH',
      '/v0/management/ampcode/restrict-management-to-localhost',
      body,
      undefined,
      'management'
    );
  }

  getAmpModelMappings() {
    return this.requestJson<KeyedValueResponse<'model-mappings', AmpModelMapping[]>>(
      'GET',
      '/v0/management/ampcode/model-mappings',
      undefined,
      undefined,
      'management'
    );
  }

  putAmpModelMappings(body: AmpModelMapping[] | AmpModelMappingsPatch) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PUT',
      '/v0/management/ampcode/model-mappings',
      body,
      undefined,
      'management'
    );
  }

  patchAmpModelMappings(body: AmpModelMappingsPatch) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PATCH',
      '/v0/management/ampcode/model-mappings',
      body,
      undefined,
      'management'
    );
  }

  deleteAmpModelMappings(query?: { index?: number; match?: string }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'DELETE',
      '/v0/management/ampcode/model-mappings',
      undefined,
      { query },
      'management'
    );
  }

  getAmpForceModelMappings() {
    return this.requestJson<KeyedValueResponse<'force-model-mappings', boolean>>(
      'GET',
      '/v0/management/ampcode/force-model-mappings',
      undefined,
      undefined,
      'management'
    );
  }

  putAmpForceModelMappings(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PUT',
      '/v0/management/ampcode/force-model-mappings',
      body,
      undefined,
      'management'
    );
  }

  patchAmpForceModelMappings(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PATCH',
      '/v0/management/ampcode/force-model-mappings',
      body,
      undefined,
      'management'
    );
  }

  getAmpUpstreamApiKeys() {
    return this.requestJson<KeyedValueResponse<'upstream-api-keys', AmpUpstreamAPIKeyEntry[]>>(
      'GET',
      '/v0/management/ampcode/upstream-api-keys',
      undefined,
      undefined,
      'management'
    );
  }

  putAmpUpstreamApiKeys(body: AmpUpstreamAPIKeyEntry[] | AmpUpstreamAPIKeysPatch) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PUT',
      '/v0/management/ampcode/upstream-api-keys',
      body,
      undefined,
      'management'
    );
  }

  patchAmpUpstreamApiKeys(body: AmpUpstreamAPIKeysPatch) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'PATCH',
      '/v0/management/ampcode/upstream-api-keys',
      body,
      undefined,
      'management'
    );
  }

  deleteAmpUpstreamApiKeys(query?: { index?: number; match?: string }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>(
      'DELETE',
      '/v0/management/ampcode/upstream-api-keys',
      undefined,
      { query },
      'management'
    );
  }

  getRequestRetry() {
    return this.requestJson<KeyedValueResponse<'request-retry', number>>('GET', '/v0/management/request-retry', undefined, undefined, 'management');
  }

  putRequestRetry(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/request-retry', body, undefined, 'management');
  }

  patchRequestRetry(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/request-retry', body, undefined, 'management');
  }

  getMaxRetryInterval() {
    return this.requestJson<KeyedValueResponse<'max-retry-interval', number>>('GET', '/v0/management/max-retry-interval', undefined, undefined, 'management');
  }

  putMaxRetryInterval(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/max-retry-interval', body, undefined, 'management');
  }

  patchMaxRetryInterval(body: KeyedValueResponse<'value', number>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/max-retry-interval', body, undefined, 'management');
  }

  getForceModelPrefix() {
    return this.requestJson<KeyedValueResponse<'force-model-prefix', boolean>>('GET', '/v0/management/force-model-prefix', undefined, undefined, 'management');
  }

  putForceModelPrefix(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/force-model-prefix', body, undefined, 'management');
  }

  patchForceModelPrefix(body: KeyedValueResponse<'value', boolean>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/force-model-prefix', body, undefined, 'management');
  }

  getRoutingStrategy() {
    return this.requestJson<KeyedValueResponse<'strategy', string>>('GET', '/v0/management/routing/strategy', undefined, undefined, 'management');
  }

  putRoutingStrategy(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/routing/strategy', body, undefined, 'management');
  }

  patchRoutingStrategy(body: KeyedValueResponse<'value', string>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/routing/strategy', body, undefined, 'management');
  }

  getClaudeKeys() {
    return this.requestJson<KeyedValueResponse<'claude-api-key', ClaudeKey[]>>('GET', '/v0/management/claude-api-key', undefined, undefined, 'management');
  }

  putClaudeKeys(body: ClaudeKey[] | { items: ClaudeKey[] }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/claude-api-key', body, undefined, 'management');
  }

  patchClaudeKey(body: PatchByIndexOrMatch<ClaudeKeyPatch>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/claude-api-key', body, undefined, 'management');
  }

  deleteClaudeKey(query?: { 'api-key'?: string; index?: number }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/claude-api-key', undefined, { query }, 'management');
  }

  getCodexKeys() {
    return this.requestJson<KeyedValueResponse<'codex-api-key', CodexKey[]>>('GET', '/v0/management/codex-api-key', undefined, undefined, 'management');
  }

  putCodexKeys(body: CodexKey[] | { items: CodexKey[] }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/codex-api-key', body, undefined, 'management');
  }

  patchCodexKey(body: PatchByIndexOrMatch<CodexKeyPatch>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/codex-api-key', body, undefined, 'management');
  }

  deleteCodexKey(query?: { 'api-key'?: string; index?: number }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/codex-api-key', undefined, { query }, 'management');
  }

  getOpenAICompatibility() {
    return this.requestJson<KeyedValueResponse<'openai-compatibility', OpenAICompatibility[]>>('GET', '/v0/management/openai-compatibility', undefined, undefined, 'management');
  }

  putOpenAICompatibility(body: OpenAICompatibility[] | { items: OpenAICompatibility[] }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/openai-compatibility', body, undefined, 'management');
  }

  patchOpenAICompatibility(body: PatchByIndexOrMatch<OpenAICompatPatch>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/openai-compatibility', body, undefined, 'management');
  }

  deleteOpenAICompatibility(query?: { name?: string; index?: number }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/openai-compatibility', undefined, { query }, 'management');
  }

  getVertexCompatKeys() {
    return this.requestJson<KeyedValueResponse<'vertex-api-key', VertexCompatKey[]>>('GET', '/v0/management/vertex-api-key', undefined, undefined, 'management');
  }

  putVertexCompatKeys(body: VertexCompatKey[] | { items: VertexCompatKey[] }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/vertex-api-key', body, undefined, 'management');
  }

  patchVertexCompatKey(body: PatchByIndexOrMatch<VertexCompatPatch>) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/vertex-api-key', body, undefined, 'management');
  }

  deleteVertexCompatKey(query?: { 'api-key'?: string; index?: number }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/vertex-api-key', undefined, { query }, 'management');
  }

  getOAuthExcludedModels() {
    return this.requestJson<KeyedValueResponse<'oauth-excluded-models', Record<string, string[]>>>(
      'GET',
      '/v0/management/oauth-excluded-models',
      undefined,
      undefined,
      'management'
    );
  }

  putOAuthExcludedModels(body: Record<string, string[]> | { items: Record<string, string[]> }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/oauth-excluded-models', body, undefined, 'management');
  }

  patchOAuthExcludedModels(body: OAuthExcludedModelsPatch) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/oauth-excluded-models', body, undefined, 'management');
  }

  deleteOAuthExcludedModels(query?: { provider?: string }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/oauth-excluded-models', undefined, { query }, 'management');
  }

  getOAuthModelAlias() {
    return this.requestJson<KeyedValueResponse<'oauth-model-alias', Record<string, OAuthModelAlias[]>>>(
      'GET',
      '/v0/management/oauth-model-alias',
      undefined,
      undefined,
      'management'
    );
  }

  putOAuthModelAlias(body: Record<string, OAuthModelAlias[]> | { items: Record<string, OAuthModelAlias[]> }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PUT', '/v0/management/oauth-model-alias', body, undefined, 'management');
  }

  patchOAuthModelAlias(body: PatchByIndexOrMatch<OAuthModelAliasPatch> | OAuthModelAliasPatch) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('PATCH', '/v0/management/oauth-model-alias', body, undefined, 'management');
  }

  deleteOAuthModelAlias(query?: { provider?: string; channel?: string }) {
    return this.requestJson<KeyedValueResponse<'status', 'ok'>>('DELETE', '/v0/management/oauth-model-alias', undefined, { query }, 'management');
  }

  listAuthFiles(query?: AuthFileListQuery) {
    return this.requestJson<AuthFileListResponse>('GET', '/v0/management/auth-files', undefined, { query: query as Record<string, string | number | boolean | undefined> }, 'management');
  }

  getAuthFileModels(query: AuthFileModelsQuery) {
    return this.requestJson<AuthFileModelsResponse>(
      'GET',
      '/v0/management/auth-files/models',
      undefined,
      { query: { name: query.name } },
      'management'
    );
  }

  getStaticModelDefinitions(channel: string) {
    return this.requestRaw('GET', `/v0/management/model-definitions/${encodeURIComponent(channel)}`, undefined, undefined, 'management');
  }

  downloadAuthFile(query: { name: string }) {
    return this.requestRaw('GET', '/v0/management/auth-files/download', undefined, { query }, 'management');
  }

  uploadAuthFile(file: Blob, name?: string) {
    const form = new FormData();
    form.append('file', file);
    if (name) form.append('name', name);
    return this.requestRaw('POST', '/v0/management/auth-files', form, undefined, 'management');
  }

  deleteAuthFile(query: { name: string }) {
    return this.requestJson<AuthFileDeleteResponse>('DELETE', '/v0/management/auth-files', undefined, { query }, 'management');
  }

  patchAuthFileStatus(body: AuthFileStatusRequest) {
    return this.requestJson<AuthFileStatusResponse>('PATCH', '/v0/management/auth-files/status', body, undefined, 'management');
  }

  importVertexCredential(file: Blob) {
    const form = new FormData();
    form.append('file', file);
    return this.requestRaw('POST', '/v0/management/vertex/import', form, undefined, 'management');
  }

  requestAnthropicAuthUrl() {
    return this.requestJson<OAuthStartResponse>('GET', '/v0/management/anthropic-auth-url', undefined, undefined, 'management');
  }

  requestCodexAuthUrl() {
    return this.requestJson<OAuthStartResponse>('GET', '/v0/management/codex-auth-url', undefined, undefined, 'management');
  }

  requestGeminiCliAuthUrl() {
    return this.requestJson<OAuthStartResponse>('GET', '/v0/management/gemini-cli-auth-url', undefined, undefined, 'management');
  }

  requestAntigravityAuthUrl() {
    return this.requestJson<OAuthStartResponse>('GET', '/v0/management/antigravity-auth-url', undefined, undefined, 'management');
  }

  requestQwenAuthUrl() {
    return this.requestJson<OAuthStartResponse>('GET', '/v0/management/qwen-auth-url', undefined, undefined, 'management');
  }

  requestKimiAuthUrl() {
    return this.requestJson<OAuthStartResponse>('GET', '/v0/management/kimi-auth-url', undefined, undefined, 'management');
  }

  requestIFlowAuthUrl() {
    return this.requestJson<OAuthStartResponse>('GET', '/v0/management/iflow-auth-url', undefined, undefined, 'management');
  }

  requestIFlowCookieToken(body: KeyedValueResponse<'cookie', string>) {
    return this.requestJson<OAuthStartResponse>('POST', '/v0/management/iflow-auth-url', body, undefined, 'management');
  }

  postOAuthCallback(body: OAuthCallbackRequest) {
    return this.requestJson<OAuthCallbackResponse>('POST', '/v0/management/oauth-callback', body, undefined, 'management');
  }

  getAuthStatus(query?: { state?: string }) {
    return this.requestJson<AuthStatusResponse>('GET', '/v0/management/get-auth-status', undefined, { query }, 'management');
  }
}
