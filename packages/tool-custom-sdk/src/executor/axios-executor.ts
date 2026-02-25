import { Buffer } from 'buffer';
import { createHash, createHmac, createSign, randomBytes } from 'crypto';

import axios, { AxiosInstance, AxiosProxyConfig, AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';

import { AuthConfig } from '../types/auth';
import { ExecutionContext, ExecutionPolicy, ExecutionResult } from '../types/execution';
import {
  FileUrlRef,
  RequestBodyDefinition,
  RequestBodyField,
  RequestDefinition,
  RequestParamItem,
} from '../types/ir';
import { resolveDeep, resolveTemplate, VariableSource } from '../utils/variable-resolver';
import { maskHeaders } from '../utils/masking';

export interface AxiosProxyOptions {
  protocol?: string;
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
}

export interface AxiosExecutorOptions {
  proxy?: AxiosProxyOptions | false;
  timeoutMs?: number;
  maxRedirects?: number;
}

type PrimitiveValue = string | number | boolean;
type PrimitiveMap = { [key: string]: PrimitiveValue | PrimitiveValue[] };
type ToolArgumentsEnvelope = {
  path?: PrimitiveMap;
  query?: PrimitiveMap;
  headers?: PrimitiveMap;
  cookies?: PrimitiveMap;
  body?: unknown;
  fields?: RequestBodyField[];
};

export class AxiosExecutor {
  private readonly client: AxiosInstance;
  private readonly oauth2TokenCache = new Map<string, { token: string; tokenType?: string; expiresAt?: number }>();

  constructor(private readonly options?: AxiosExecutorOptions) {
    const clientOptions: {
      proxy?: AxiosProxyConfig | false;
      timeout?: number;
      maxRedirects?: number;
      validateStatus: () => true;
    } = {
      validateStatus: () => true,
    };
    if (options?.proxy !== undefined) {
      clientOptions.proxy = options.proxy as AxiosProxyConfig | false;
    }
    if (options?.timeoutMs !== undefined) {
      clientOptions.timeout = options.timeoutMs;
    }
    if (options?.maxRedirects !== undefined) {
      clientOptions.maxRedirects = options.maxRedirects;
    }
    this.client = axios.create(clientOptions);
  }

  async execute(params: {
    request: RequestDefinition;
    args?: ToolArgumentsEnvelope;
    envVars: VariableSource;
    auth?: AuthConfig;
    context: ExecutionContext;
    policy?: ExecutionPolicy;
  }): Promise<ExecutionResult> {
    const start = Date.now();

    const policy = params.policy ?? {};

    const urlTemplateResolved = resolveTemplate(params.request.urlTemplate, params.envVars);
    const url = this.applyArgsToUrl(urlTemplateResolved, params.args, params.envVars);

    this.enforceAllowedHost(url, policy.allowedHosts);

    const headers = this.mergeKeyValueItems(params.request.headers);
    const query = this.mergeKeyValueItems(params.request.queryParams);
    const cookies = this.mergeKeyValueItems(params.request.cookies);

    const resolvedArgs = resolveDeep<ToolArgumentsEnvelope>(params.args ?? {}, params.envVars);

    this.applyArgsToKeyValue(headers, resolvedArgs?.headers, { blockSensitive: params.context.mode === 'agent' });
    this.applyArgsToKeyValue(query, resolvedArgs?.query);
    this.applyArgsToKeyValue(cookies, resolvedArgs?.cookies);

    const cfg: AxiosRequestConfig = {
      method: params.request.method,
      url,
      headers: { ...headers },
      params: query,
      validateStatus: () => true,
    };
    const timeout = params.request.timeoutMs ?? this.options?.timeoutMs;
    if (timeout !== undefined) {
      cfg.timeout = timeout;
    }
    const maxRedirects =
      params.request.followRedirects === false ? 0 : (params.request.maxRedirects ?? this.options?.maxRedirects);
    if (maxRedirects !== undefined) {
      cfg.maxRedirects = maxRedirects;
    }

    if (policy.maxResponseBytes !== undefined) {
      cfg.maxContentLength = policy.maxResponseBytes;
    }

    if (Object.keys(cookies).length) {
      const cookieHeader = Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');
      this.setHeader(cfg, 'Cookie', cookieHeader);
    }

    const bodyArg = resolvedArgs?.body;
    if (params.request.body) {
      await this.applyBody(cfg, params.request.body, bodyArg, params.envVars, policy);
    } else if (bodyArg !== undefined) {
      this.setHeaderIfMissing(cfg, 'Content-Type', 'application/json');
      cfg.data = bodyArg;
    }

    if (params.auth) {
      await this.applyAuth(cfg, params.auth, params.envVars);
    }

    const resp: AxiosResponse = await this.client.request(cfg);

    const durationMs = Date.now() - start;

    const outHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(resp.headers ?? {})) {
      if (Array.isArray(v)) outHeaders[k] = v.join(',');
      else if (v === undefined || v === null) continue;
      else outHeaders[k] = String(v);
    }

    const sanitizedHeaders = params.context.mode === 'agent' ? maskHeaders(outHeaders) : outHeaders;

    return {
      status: resp.status,
      headers: sanitizedHeaders,
      body: resp.data,
      durationMs,
    };
  }

  private applyArgsToUrl(url: string, args: ToolArgumentsEnvelope | undefined, envVars: VariableSource): string {
    if (!args?.path) return url;

    const mergedVars: VariableSource = { ...envVars };
    for (const [k, v] of Object.entries(args.path)) mergedVars[k] = v === undefined ? '' : String(v);

    return resolveTemplate(url, mergedVars);
  }

  private mergeKeyValueItems(items?: RequestParamItem[]): Record<string, string> {
    const out: Record<string, string> = {};
    for (const it of items ?? []) {
      if (it.enabled === false) continue;
      out[it.key] = it.value ?? '';
    }
    return out;
  }

  private applyArgsToKeyValue(target: Record<string, string>, source: PrimitiveMap | undefined, opts?: { blockSensitive?: boolean }): void {
    if (!source) return;
    for (const [k, v] of Object.entries(source)) {
      if (v === undefined || v === null) continue;

      if (opts?.blockSensitive) {
        const lowered = String(k).toLowerCase();
        if (lowered === 'authorization' || lowered === 'proxy-authorization' || lowered === 'cookie') {
          continue;
        }
      }

      target[k] = Array.isArray(v) ? v.map((it: PrimitiveValue) => String(it)).join(',') : String(v);
    }
  }

  private async applyAuth(cfg: AxiosRequestConfig, auth: AuthConfig, envVars: VariableSource): Promise<void> {
    const resolved = resolveDeep(auth, envVars);

    if (resolved.type === 'none') return;

    if (resolved.type === 'bearer') {
      const token = resolved.token ?? '';
      this.setHeader(cfg, 'Authorization', `Bearer ${token}`);
      return;
    }

    if (resolved.type === 'basic') {
      const user = resolved.username ?? '';
      const pass = resolved.password ?? '';
      const basic = Buffer.from(`${user}:${pass}`).toString('base64');
      this.setHeader(cfg, 'Authorization', `Basic ${basic}`);
      return;
    }

    if (resolved.type === 'apiKey') {
      const placement = resolved.placement ?? 'header';
      const value = resolved.token ?? '';
      if (placement === 'header') {
        const headerName = resolved.headerName ?? 'X-API-KEY';
        this.setHeader(cfg, headerName, value);
      } else if (placement === 'query') {
        const param = resolved.queryParamName ?? 'api_key';
        this.setParam(cfg, param, value);
      } else {
        const cookieName = resolved.headerName ?? 'api_key';
        this.appendCookie(cfg, cookieName, value);
      }
      return;
    }

    if (resolved.type === 'oauth2') {
      await this.applyOAuth2(cfg, resolved);
      return;
    }

    if (resolved.type === 'openIdConnect') {
      await this.applyOpenIdConnect(cfg, resolved);
      return;
    }

    if (resolved.type === 'oauth1') {
      this.applyOAuth1(cfg, resolved);
      return;
    }

    if (resolved.type === 'awsSigV4') {
      this.applyAwsSigV4(cfg, resolved);
      return;
    }

    if (resolved.type === 'hawk') {
      this.applyHawk(cfg, resolved);
      return;
    }

    if (resolved.type === 'digest') {
      this.applyDigest(cfg, resolved);
      return;
    }

    if (resolved.type === 'ntlm') {
      this.applyNtlm(cfg, resolved);
      return;
    }

    if (resolved.type === 'custom') {
      const c = resolved.custom;
      if (c?.providerId) {
        throw new Error('custom auth providerId chưa được implement');
      }
      if (c?.headers) {
        for (const [k, v] of Object.entries(c.headers)) this.setHeader(cfg, k, String(v));
      }
      if (c?.query) {
        for (const [k, v] of Object.entries(c.query)) this.setParam(cfg, k, String(v));
      }
      if (c?.cookies) {
        for (const [k, v] of Object.entries(c.cookies)) this.appendCookie(cfg, k, String(v));
      }
      return;
    }

    const unknownType = (resolved as { type?: string }).type ?? 'unknown';
    throw new Error(`auth type chưa hỗ trợ execute: ${unknownType}`);
  }

  private async applyOAuth2(cfg: AxiosRequestConfig, auth: Extract<AuthConfig, { type: 'oauth2' }>): Promise<void> {
    const oauth2 = auth.oauth2 ?? {};
    let token = oauth2.accessToken;
    let tokenType = oauth2.tokenType ?? 'Bearer';

    if (!token) {
      const tokenRequest: {
        tokenUrl?: string;
        clientId?: string;
        clientSecret?: string;
        scopes?: string[];
        refreshToken?: string;
        authorizationCode?: string;
        redirectUri?: string;
        codeVerifier?: string;
        username?: string;
        password?: string;
      } = {};
      if (oauth2.tokenUrl !== undefined) tokenRequest.tokenUrl = oauth2.tokenUrl;
      if (oauth2.clientId !== undefined) tokenRequest.clientId = oauth2.clientId;
      if (oauth2.clientSecret !== undefined) tokenRequest.clientSecret = oauth2.clientSecret;
      if (oauth2.scopes !== undefined) tokenRequest.scopes = oauth2.scopes;
      if (oauth2.refreshToken !== undefined) tokenRequest.refreshToken = oauth2.refreshToken;
      if (oauth2.authorizationCode !== undefined) tokenRequest.authorizationCode = oauth2.authorizationCode;
      if (oauth2.redirectUri !== undefined) tokenRequest.redirectUri = oauth2.redirectUri;
      if (oauth2.codeVerifier !== undefined) tokenRequest.codeVerifier = oauth2.codeVerifier;
      if (oauth2.username !== undefined) tokenRequest.username = oauth2.username;
      if (oauth2.password !== undefined) tokenRequest.password = oauth2.password;
      const fetched = await this.fetchOAuth2Token(tokenRequest);
      token = fetched.token;
      tokenType = fetched.tokenType ?? tokenType;
      if (fetched.refreshToken && !oauth2.refreshToken) {
        oauth2.refreshToken = fetched.refreshToken;
      }
    }

    if (!token) {
      throw new Error('OAuth2 thiếu accessToken hoặc không thể lấy token từ tokenUrl');
    }

    this.setHeader(cfg, 'Authorization', `${tokenType} ${token}`);
  }

  private async applyOpenIdConnect(cfg: AxiosRequestConfig, auth: Extract<AuthConfig, { type: 'openIdConnect' }>): Promise<void> {
    let token = auth.accessToken;
    let tokenType = auth.tokenType ?? 'Bearer';

    if (!token) {
      const tokenRequest: {
        tokenUrl?: string;
        clientId?: string;
        clientSecret?: string;
        scopes?: string[];
      } = {};
      const tokenUrl = auth.tokenUrl ?? auth.openIdConnectUrl;
      if (tokenUrl !== undefined) tokenRequest.tokenUrl = tokenUrl;
      if (auth.clientId !== undefined) tokenRequest.clientId = auth.clientId;
      if (auth.clientSecret !== undefined) tokenRequest.clientSecret = auth.clientSecret;
      if (auth.scopes !== undefined) tokenRequest.scopes = auth.scopes;
      const fetched = await this.fetchOAuth2Token(tokenRequest);
      token = fetched.token;
      tokenType = fetched.tokenType ?? tokenType;
    }

    if (!token) {
      throw new Error('OpenID Connect thiếu accessToken hoặc không thể lấy token từ tokenUrl');
    }

    this.setHeader(cfg, 'Authorization', `${tokenType} ${token}`);
  }

  private async fetchOAuth2Token(params: {
    tokenUrl?: string;
    clientId?: string;
    clientSecret?: string;
    scopes?: string[];
    refreshToken?: string;
    authorizationCode?: string;
    redirectUri?: string;
    codeVerifier?: string;
    username?: string;
    password?: string;
  }): Promise<{ token: string; tokenType?: string; expiresAt?: number; refreshToken?: string }> {
    if (!params.tokenUrl) {
      throw new Error('Thiếu tokenUrl để lấy OAuth2 token');
    }

    const scope = (params.scopes ?? []).join(' ');
    const cacheKey = `${params.tokenUrl}::${params.clientId ?? ''}::${scope}::${params.username ?? ''}`;
    const cached = this.oauth2TokenCache.get(cacheKey);
    if (cached && (!cached.expiresAt || cached.expiresAt > Date.now() + 10_000)) {
      return cached;
    }

    const form = new URLSearchParams();
    if (params.refreshToken) {
      form.append('grant_type', 'refresh_token');
      form.append('refresh_token', params.refreshToken);
    } else if (params.authorizationCode) {
      form.append('grant_type', 'authorization_code');
      form.append('code', params.authorizationCode);
      if (params.redirectUri) form.append('redirect_uri', params.redirectUri);
      if (params.codeVerifier) form.append('code_verifier', params.codeVerifier);
    } else if (params.username || params.password) {
      form.append('grant_type', 'password');
      form.append('username', params.username ?? '');
      form.append('password', params.password ?? '');
      if (scope) form.append('scope', scope);
    } else {
      form.append('grant_type', 'client_credentials');
      if (scope) form.append('scope', scope);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (params.clientId && params.clientSecret) {
      const basic = Buffer.from(`${params.clientId}:${params.clientSecret}`).toString('base64');
      headers['Authorization'] = `Basic ${basic}`;
    } else if (params.clientId) {
      form.append('client_id', params.clientId);
      if (params.clientSecret) form.append('client_secret', params.clientSecret);
    }

    const resp = await this.client.request({
      method: 'POST',
      url: params.tokenUrl,
      headers,
      data: form,
      validateStatus: () => true,
    });

    if (resp.status < 200 || resp.status >= 300) {
      throw new Error(`Lấy OAuth2 token thất bại (${resp.status})`);
    }

    const tokenPayload = this.asRecord(resp.data);
    const token = this.readString(tokenPayload, 'access_token') ?? this.readString(tokenPayload, 'token');
    if (!token) {
      throw new Error('Không tìm thấy access_token trong phản hồi token');
    }

    const tokenType = this.readString(tokenPayload, 'token_type') ?? 'Bearer';
    const expiresIn = Number(this.readString(tokenPayload, 'expires_in') ?? 0);
    const expiresAt = expiresIn > 0 ? Date.now() + expiresIn * 1000 : undefined;
    const refreshToken = this.readString(tokenPayload, 'refresh_token') ?? params.refreshToken;

    const result: { token: string; tokenType?: string; expiresAt?: number; refreshToken?: string } = { token };
    if (tokenType !== undefined) {
      result.tokenType = tokenType;
    }
    if (expiresAt !== undefined) {
      result.expiresAt = expiresAt;
    }
    if (refreshToken !== undefined) {
      result.refreshToken = refreshToken;
    }
    this.oauth2TokenCache.set(cacheKey, result);
    return result;
  }

  private applyOAuth1(cfg: AxiosRequestConfig, auth: Extract<AuthConfig, { type: 'oauth1' }>): void {
    const oauth1 = auth.oauth1 ?? {};
    const consumerKey = oauth1.consumerKey ?? '';
    const consumerSecret = oauth1.consumerSecret ?? '';
    const token = oauth1.token;
    const tokenSecret = oauth1.tokenSecret ?? '';
    const signatureMethod = (oauth1.signatureMethod ?? 'HMAC-SHA1').toUpperCase();
    const realm = oauth1.realm;

    if (!consumerKey || !consumerSecret) {
      throw new Error('OAuth1 thiếu consumerKey/consumerSecret');
    }

    const nonce = oauth1.nonce ?? this.randomString(12);
    const timestamp = oauth1.timestamp ?? Math.floor(Date.now() / 1000).toString();

    const url = new URL(String(cfg.url));
    const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;
    const method = String(cfg.method ?? 'GET').toUpperCase();

    const params: Array<[string, string]> = [];

    for (const [k, v] of url.searchParams.entries()) params.push([k, v]);
    for (const [k, v] of this.paramEntries(cfg.params)) params.push([k, v]);

    const contentType = this.getHeader(cfg, 'content-type');
    if (contentType && contentType.startsWith('application/x-www-form-urlencoded')) {
      for (const [k, v] of this.bodyParamEntries(cfg.data)) params.push([k, v]);
    }

    params.push(['oauth_consumer_key', consumerKey]);
    params.push(['oauth_nonce', nonce]);
    params.push(['oauth_signature_method', signatureMethod]);
    params.push(['oauth_timestamp', timestamp]);
    params.push(['oauth_version', '1.0']);
    if (token) params.push(['oauth_token', token]);

    const normalized = this.normalizeParams(params);
    const baseString = [
      method,
      this.rfc3986(baseUrl),
      this.rfc3986(normalized),
    ].join('&');

    let signature = '';
    if (signatureMethod === 'PLAINTEXT') {
      signature = `${this.rfc3986(consumerSecret)}&${this.rfc3986(tokenSecret)}`;
    } else if (signatureMethod === 'HMAC-SHA1') {
      const key = `${this.rfc3986(consumerSecret)}&${this.rfc3986(tokenSecret)}`;
      signature = createHmac('sha1', key).update(baseString).digest('base64');
    } else if (signatureMethod === 'RSA-SHA1') {
      if (!oauth1.privateKey) throw new Error('OAuth1 RSA-SHA1 thiếu privateKey');
      signature = createSign('RSA-SHA1').update(baseString).sign(oauth1.privateKey, 'base64');
    } else {
      throw new Error(`OAuth1 signatureMethod không hỗ trợ: ${signatureMethod}`);
    }

    const headerParams: Array<[string, string]> = [
      ['oauth_consumer_key', consumerKey],
      ['oauth_nonce', nonce],
      ['oauth_signature', signature],
      ['oauth_signature_method', signatureMethod],
      ['oauth_timestamp', timestamp],
      ['oauth_version', '1.0'],
    ];
    if (token) headerParams.push(['oauth_token', token]);

    const header = this.buildOAuthHeader(headerParams, realm);
    this.setHeader(cfg, 'Authorization', header);
  }

  private applyAwsSigV4(cfg: AxiosRequestConfig, auth: Extract<AuthConfig, { type: 'awsSigV4' }>): void {
    const s = auth.awsSigV4 ?? {};
    const accessKeyId = s.accessKeyId ?? '';
    const secretAccessKey = s.secretAccessKey ?? '';
    const region = s.region ?? '';
    const service = s.service ?? '';

    if (!accessKeyId || !secretAccessKey || !region || !service) {
      throw new Error('AWS SigV4 thiếu accessKeyId/secretAccessKey/region/service');
    }

    const url = new URL(String(cfg.url));
    const method = String(cfg.method ?? 'GET').toUpperCase();

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    const payloadHash = this.hashPayload(cfg.data);

    this.ensureHeader(cfg, 'host', url.host);
    this.ensureHeader(cfg, 'x-amz-date', amzDate);
    this.ensureHeader(cfg, 'x-amz-content-sha256', payloadHash);
    if (s.sessionToken) {
      this.ensureHeader(cfg, 'x-amz-security-token', s.sessionToken);
    }

    const canonicalUri = this.encodePath(url.pathname);
    const canonicalQueryString = this.buildCanonicalQueryString(url, cfg.params);

    const { canonicalHeaders, signedHeaders } = this.buildCanonicalHeaders(this.getHeadersMap(cfg));

    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      this.sha256Hex(canonicalRequest),
    ].join('\n');

    const signingKey = this.getAwsSigningKey(secretAccessKey, dateStamp, region, service);
    const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    this.setHeader(cfg, 'Authorization', authorization);
  }

  private applyHawk(cfg: AxiosRequestConfig, auth: Extract<AuthConfig, { type: 'hawk' }>): void {
    const id = auth.id ?? '';
    const key = auth.key ?? '';
    const algorithm = (auth.algorithm ?? 'sha256').toLowerCase();
    if (!id || !key) throw new Error('Hawk thiếu id/key');

    const url = new URL(String(cfg.url));
    const method = String(cfg.method ?? 'GET').toUpperCase();
    const ts = auth.timestamp ? String(auth.timestamp) : Math.floor(Date.now() / 1000).toString();
    const nonce = auth.nonce ?? this.randomString(6);
    const ext = auth.ext ?? '';

    const resource = `${url.pathname}${url.search}`;
    const host = url.hostname;
    const port = url.port ? url.port : url.protocol === 'https:' ? '443' : '80';

    const payload = this.payloadString(cfg.data);
    const contentType = this.getHeader(cfg, 'content-type') ?? '';
    const hash = payload ? this.hawkPayloadHash(payload, contentType, algorithm) : '';

    const normalized = [
      'hawk.1.header',
      ts,
      nonce,
      method,
      resource,
      host,
      port,
      hash,
      ext,
      '',
      '',
    ].join('\n');

    const mac = createHmac(algorithm, key).update(normalized).digest('base64');
    const header = [
      `Hawk id="${id}"`,
      `ts="${ts}"`,
      `nonce="${nonce}"`,
      `mac="${mac}"`,
    ];
    if (hash) header.push(`hash="${hash}"`);
    if (ext) header.push(`ext="${this.escapeHeaderValue(ext)}"`);

    this.setHeader(cfg, 'Authorization', header.join(', '));
  }

  private applyDigest(cfg: AxiosRequestConfig, auth: Extract<AuthConfig, { type: 'digest' }>): void {
    const username = auth.username ?? '';
    const password = auth.password ?? '';
    const realm = auth.realm ?? '';
    const nonce = auth.nonce ?? '';
    const qop = auth.qop ?? 'auth';
    const algorithm = (auth.algorithm ?? 'MD5').toUpperCase();
    const opaque = auth.opaque;

    if (!username || !password || !realm || !nonce) {
      throw new Error('Digest auth thiếu username/password/realm/nonce');
    }

    const url = new URL(String(cfg.url));
    const uri = `${url.pathname}${url.search}`;
    const method = String(cfg.method ?? 'GET').toUpperCase();

    const ha1Base = this.md5(`${username}:${realm}:${password}`);
    const cnonce = this.randomString(16);
    const nc = '00000001';
    const ha1 = algorithm === 'MD5-SESS' ? this.md5(`${ha1Base}:${nonce}:${cnonce}`) : ha1Base;
    const ha2 = this.md5(`${method}:${uri}`);
    const response = qop
      ? this.md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
      : this.md5(`${ha1}:${nonce}:${ha2}`);

    const parts = [
      `username="${username}"`,
      `realm="${realm}"`,
      `nonce="${nonce}"`,
      `uri="${uri}"`,
      `response="${response}"`,
      `algorithm=${algorithm}`,
    ];
    if (opaque) parts.push(`opaque="${opaque}"`);
    if (qop) {
      parts.push(`qop=${qop}`);
      parts.push(`nc=${nc}`);
      parts.push(`cnonce="${cnonce}"`);
    }

    this.setHeader(cfg, 'Authorization', `Digest ${parts.join(', ')}`);
  }

  private applyNtlm(cfg: AxiosRequestConfig, auth: Extract<AuthConfig, { type: 'ntlm' }>): void {
    if (auth.authorization) {
      this.setHeader(cfg, 'Authorization', auth.authorization);
      return;
    }
    throw new Error('NTLM cần authorization token có sẵn (chưa hỗ trợ handshake)');
  }

  private randomString(len: number): string {
    return randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
  }

  private escapeHeaderValue(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  private getHeader(cfg: AxiosRequestConfig, name: string): string | undefined {
    const headers = this.getHeadersMap(cfg);
    const target = name.toLowerCase();
    for (const [k, v] of Object.entries(headers)) {
      if (k.toLowerCase() === target) return Array.isArray(v) ? v.join(',') : String(v);
    }
    return undefined;
  }

  private ensureHeader(cfg: AxiosRequestConfig, name: string, value: string): void {
    const headers = this.getHeadersMap(cfg);
    const target = name.toLowerCase();
    for (const k of Object.keys(headers)) {
      if (k.toLowerCase() === target) return;
    }
    headers[name] = value;
  }

  private setHeader(cfg: AxiosRequestConfig, name: string, value: string): void {
    const headers = this.getHeadersMap(cfg);
    headers[name] = value;
  }

  private setHeaderIfMissing(cfg: AxiosRequestConfig, name: string, value: string): void {
    const target = name.toLowerCase();
    const headers = this.getHeadersMap(cfg);
    const exists = Object.keys(headers).some((k: string) => k.toLowerCase() === target);
    if (!exists) {
      headers[name] = value;
    }
  }

  private appendCookie(cfg: AxiosRequestConfig, cookieName: string, value: string): void {
    const prev = this.getHeader(cfg, 'cookie');
    const next = `${cookieName}=${value}`;
    this.setHeader(cfg, 'Cookie', prev ? `${prev}; ${next}` : next);
  }

  private setParam(cfg: AxiosRequestConfig, key: string, value: string): void {
    const current = this.paramsToObject(cfg.params);
    current[key] = value;
    cfg.params = current;
  }

  private paramsToObject(params: unknown): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of this.paramEntries(params)) {
      out[k] = v;
    }
    return out;
  }

  private getHeadersMap(cfg: AxiosRequestConfig): Record<string, unknown> {
    if (!cfg.headers || typeof cfg.headers !== 'object') {
      cfg.headers = {};
    }
    return cfg.headers as Record<string, unknown>;
  }

  private paramEntries(params: unknown): Array<[string, string]> {
    const out: Array<[string, string]> = [];
    if (!params) return out;
    if (params instanceof URLSearchParams) {
      for (const [k, v] of params.entries()) out.push([k, v]);
      return out;
    }
    if (Array.isArray(params)) {
      for (const item of params) {
        if (Array.isArray(item) && item.length >= 2) out.push([String(item[0]), String(item[1])]);
      }
      return out;
    }
    if (typeof params === 'object') {
      for (const [k, v] of Object.entries(params)) {
        if (Array.isArray(v)) {
          for (const vv of v) out.push([k, String(vv)]);
        } else if (v !== undefined && v !== null) {
          out.push([k, String(v)]);
        }
      }
    }
    return out;
  }

  private bodyParamEntries(data: unknown): Array<[string, string]> {
    if (!data) return [];
    if (data instanceof URLSearchParams) return this.paramEntries(data);
    if (typeof data === 'string') return this.paramEntries(new URLSearchParams(data));
    if (typeof data === 'object') return this.paramEntries(data);
    return [];
  }

  private normalizeParams(params: Array<[string, string]>): string {
    const encoded: Array<[string, string]> = params.map(([k, v]: [string, string]) => [this.rfc3986(k), this.rfc3986(v)]);
    encoded.sort(([ak, av]: [string, string], [bk, bv]: [string, string]) =>
      ak === bk ? (av < bv ? -1 : av > bv ? 1 : 0) : ak < bk ? -1 : 1,
    );
    return encoded.map(([k, v]: [string, string]) => `${k}=${v}`).join('&');
  }

  private rfc3986(value: string): string {
    return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  }

  private buildOAuthHeader(params: Array<[string, string]>, realm?: string): string {
    const parts: string[] = [];
    if (realm) parts.push(`realm="${this.rfc3986(realm)}"`);
    for (const [k, v] of params) {
      if (!k.startsWith('oauth_')) continue;
      parts.push(`${this.rfc3986(k)}="${this.rfc3986(v)}"`);
    }
    return `OAuth ${parts.join(', ')}`;
  }

  private payloadString(data: unknown): string {
    if (data === undefined || data === null) return '';
    if (Buffer.isBuffer(data)) return data.toString('utf8');
    if (data instanceof URLSearchParams) return data.toString();
    if (typeof data === 'string') return data;
    if (typeof data === 'object') {
      try {
        return JSON.stringify(data);
      } catch {
        return '';
      }
    }
    return String(data);
  }

  private hashPayload(data: unknown): string {
    if (data === undefined || data === null) return this.sha256Hex('');
    if (Buffer.isBuffer(data)) return this.sha256Hex(data);
    if (data instanceof URLSearchParams) return this.sha256Hex(data.toString());
    if (typeof data === 'string') return this.sha256Hex(data);
    if (typeof data === 'object') {
      const formCandidate = data as { getHeaders?: unknown; pipe?: unknown };
      const isFormData = typeof formCandidate.getHeaders === 'function' && typeof formCandidate.pipe === 'function';
      if (isFormData) return 'UNSIGNED-PAYLOAD';
      return this.sha256Hex(JSON.stringify(data));
    }
    return this.sha256Hex(String(data));
  }

  private sha256Hex(data: string | Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  private md5(data: string): string {
    return createHash('md5').update(data).digest('hex');
  }

  private buildCanonicalQueryString(url: URL, extraParams: unknown): string {
    const params: Array<[string, string]> = [];
    for (const [k, v] of url.searchParams.entries()) params.push([k, v]);
    for (const [k, v] of this.paramEntries(extraParams)) params.push([k, v]);

    const encoded: Array<[string, string]> = params.map(([k, v]: [string, string]) => [this.rfc3986(k), this.rfc3986(v)]);
    encoded.sort(([ak, av]: [string, string], [bk, bv]: [string, string]) =>
      ak === bk ? (av < bv ? -1 : av > bv ? 1 : 0) : ak < bk ? -1 : 1,
    );
    return encoded.map(([k, v]: [string, string]) => `${k}=${v}`).join('&');
  }

  private encodePath(pathname: string): string {
    return pathname
      .split('/')
      .map((seg) => this.rfc3986(seg))
      .join('/')
      .replace(/%2F/g, '/');
  }

  private buildCanonicalHeaders(headers: Record<string, unknown>): { canonicalHeaders: string; signedHeaders: string } {
    const normalized: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers ?? {})) {
      const key = k.toLowerCase().trim();
      const value = Array.isArray(v) ? v.join(',') : String(v ?? '');
      normalized[key] = value.replace(/\s+/g, ' ').trim();
    }

    const keys = Object.keys(normalized).sort();
    const canonicalHeaders = keys.map((k) => `${k}:${normalized[k]}\n`).join('');
    const signedHeaders = keys.join(';');

    return { canonicalHeaders, signedHeaders };
  }

  private getAwsSigningKey(secretAccessKey: string, dateStamp: string, region: string, service: string): Buffer {
    const kDate = createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
    const kRegion = createHmac('sha256', kDate).update(region).digest();
    const kService = createHmac('sha256', kRegion).update(service).digest();
    return createHmac('sha256', kService).update('aws4_request').digest();
  }

  private hawkPayloadHash(payload: string, contentType: string, algorithm: string): string {
    const normalized = `hawk.1.payload\n${contentType}\n${payload}\n`;
    return createHash(algorithm).update(normalized).digest('base64');
  }

  private async applyBody(
    cfg: AxiosRequestConfig,
    bodyDef: RequestBodyDefinition,
    bodyArg: unknown,
    envVars: VariableSource,
    policy: ExecutionPolicy,
  ): Promise<void> {
    const resolvedBodyDef = resolveDeep(bodyDef, envVars);

    if (resolvedBodyDef.mode === 'none') return;

    if (resolvedBodyDef.mode === 'raw') {
      const contentType = resolvedBodyDef.contentType ?? 'application/json';
      this.setHeaderIfMissing(cfg, 'Content-Type', contentType);
      if (resolvedBodyDef.rawText !== undefined) cfg.data = resolvedBodyDef.rawText;
      else if (bodyArg !== undefined) cfg.data = bodyArg;
      return;
    }

    if (resolvedBodyDef.mode === 'binary') {
      const file = this.asFileUrlRef(resolvedBodyDef.binary ?? bodyArg);
      if (!file?.url) return;
      this.enforceAllowedHost(file.url, policy.allowedFileHosts);
      const stream = await this.downloadAsStream(file.url);
      cfg.data = stream;
      this.setHeaderIfMissing(cfg, 'Content-Type', resolvedBodyDef.contentType ?? 'application/octet-stream');
      return;
    }

    if (resolvedBodyDef.mode === 'urlencoded') {
      const fields = this.mergeBodyFields(resolvedBodyDef.fields, bodyArg)
        .filter((f) => f.enabled !== false)
        .filter((f) => f.type !== 'file');

      const params = new URLSearchParams();
      for (const f of fields) {
        if (!f.key) continue;
        params.append(f.key, f.value === undefined ? '' : String(f.value));
      }

      cfg.data = params;
      this.setHeaderIfMissing(cfg, 'Content-Type', 'application/x-www-form-urlencoded');
      return;
    }

    if (resolvedBodyDef.mode === 'form-data' || resolvedBodyDef.mode === 'multipart') {
      const form = new FormData();

      const fields = this.mergeBodyFields(resolvedBodyDef.fields, bodyArg);
      for (const f of fields) {
        if (f.enabled === false) continue;
        if (!f.key) continue;

        if (f.type === 'file') {
          const ref = this.asFileUrlRef(f.value);
          if (!ref?.url) continue;
          this.enforceAllowedHost(ref.url, policy.allowedFileHosts);
          const stream = await this.downloadAsStream(ref.url);
          form.append(f.key, stream, { filename: ref.filename ?? 'file' });
        } else {
          form.append(f.key, f.value === undefined ? '' : String(f.value));
        }
      }

      cfg.data = form;
      cfg.headers = { ...this.getHeadersMap(cfg), ...form.getHeaders() };
      return;
    }
  }

  private mergeBodyFields(defFields?: RequestBodyField[], bodyArg?: unknown): RequestBodyField[] {
    const out: RequestBodyField[] = [];

    for (const f of defFields ?? []) out.push(f);

    if (bodyArg && typeof bodyArg === 'object') {
      const candidate = bodyArg as { fields?: unknown };
      if (Array.isArray(candidate.fields)) {
        for (const f of candidate.fields) {
          if (this.isRequestBodyField(f)) out.push(f);
        }
      }
    }

    return out;
  }

  private async downloadAsStream(url: string): Promise<unknown> {
    const resp = await this.client.request({
      method: 'GET',
      url,
      responseType: 'stream',
      validateStatus: () => true,
    });

    if (resp.status < 200 || resp.status >= 300) {
      throw new Error(`Tải file thất bại (${resp.status}) từ ${url}`);
    }

    return resp.data;
  }

  private enforceAllowedHost(url: string, allowedHosts?: string[]): void {
    if (!allowedHosts || allowedHosts.length === 0) return;

    const u = new URL(url);
    const host = u.host;
    if (!allowedHosts.includes(host)) {
      throw new Error(`Host không nằm trong allowlist: ${host}`);
    }
  }

  private isRequestBodyField(value: unknown): value is RequestBodyField {
    if (!value || typeof value !== 'object') return false;
    const v = value as { key?: unknown };
    return typeof v.key === 'string';
  }

  private asRecord(value: unknown): Record<string, unknown> | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    return value as Record<string, unknown>;
  }

  private readString(source: Record<string, unknown> | undefined, key: string): string | undefined {
    if (!source) return undefined;
    const value = source[key];
    if (value === undefined || value === null) return undefined;
    return String(value);
  }

  private asFileUrlRef(value: unknown): FileUrlRef | undefined {
    const data = this.asRecord(value);
    if (!data || typeof data.url !== 'string') return undefined;

    const ref: FileUrlRef = {
      url: data.url,
    };
    if (typeof data.filename === 'string') {
      ref.filename = data.filename;
    }
    return ref;
  }
}

