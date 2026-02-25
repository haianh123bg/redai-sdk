export type AuthPlacement = 'header' | 'query' | 'cookie';

export type AuthMode = 'inherit' | 'override' | 'none';

export interface OAuth2Config {
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  tokenUrl?: string;
  scopes?: string[];
  accessToken?: string;
  tokenType?: string;
  authorizationCode?: string;
  redirectUri?: string;
  codeVerifier?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
}

export interface OAuth1Config {
  consumerKey?: string;
  consumerSecret?: string;
  token?: string;
  tokenSecret?: string;
  signatureMethod?: 'HMAC-SHA1' | 'RSA-SHA1' | 'PLAINTEXT' | string;
  realm?: string;
  privateKey?: string;
  nonce?: string;
  timestamp?: string;
}

export interface AwsSigV4Config {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  region?: string;
  service?: string;
}

export interface CustomAuthConfig {
  providerId?: string;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  cookies?: Record<string, string>;
}

export type AuthFieldType = 'string' | 'number' | 'boolean' | 'secret' | 'select';

export interface AuthFieldSchema {
  key: string;
  label?: string;
  type?: AuthFieldType;
  required?: boolean;
  options?: string[];
  helpText?: string;
}

export interface AuthProfileSchema {
  title?: string;
  description?: string;
  fields: AuthFieldSchema[];
}

export interface NoneAuthConfig {
  type: 'none';
}

export interface BearerAuthConfig {
  type: 'bearer';
  token?: string;
}

export interface BasicAuthConfig {
  type: 'basic';
  username?: string;
  password?: string;
}

export interface ApiKeyAuthConfig {
  type: 'apiKey';
  placement?: AuthPlacement;
  headerName?: string;
  queryParamName?: string;
  token?: string;
}

export interface OAuth2AuthConfig {
  type: 'oauth2';
  oauth2?: OAuth2Config;
}

export interface OpenIdConnectAuthConfig {
  type: 'openIdConnect';
  openIdConnectUrl?: string;
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  tokenUrl?: string;
  accessToken?: string;
  tokenType?: string;
}

export interface OAuth1AuthConfig {
  type: 'oauth1';
  oauth1?: OAuth1Config;
}

export interface AwsSigV4AuthConfig {
  type: 'awsSigV4';
  awsSigV4?: AwsSigV4Config;
}

export interface HawkAuthConfig {
  type: 'hawk';
  id?: string;
  key?: string;
  algorithm?: string;
  ext?: string;
  nonce?: string;
  timestamp?: string;
}

export interface DigestAuthConfig {
  type: 'digest';
  username?: string;
  password?: string;
  realm?: string;
  nonce?: string;
  opaque?: string;
  algorithm?: string;
  qop?: string;
}

export interface NtlmAuthConfig {
  type: 'ntlm';
  username?: string;
  password?: string;
  domain?: string;
  workstation?: string;
  authorization?: string;
}

export interface CustomAuthConfigWrapper {
  type: 'custom';
  custom?: CustomAuthConfig;
}

export type AuthConfig =
  | NoneAuthConfig
  | BearerAuthConfig
  | BasicAuthConfig
  | ApiKeyAuthConfig
  | OAuth2AuthConfig
  | OpenIdConnectAuthConfig
  | OAuth1AuthConfig
  | AwsSigV4AuthConfig
  | HawkAuthConfig
  | DigestAuthConfig
  | NtlmAuthConfig
  | CustomAuthConfigWrapper;

export interface AuthProfile {
  id: string;
  collectionId: string;
  versionId?: string;

  name: string;
  isDefault?: boolean;
  enabled?: boolean;

  config: AuthConfig;
  // Chính sách refresh token: manual hoặc auto.
  refreshPolicy?: 'manual' | 'auto';
  // Lịch cron cho auto refresh (nếu dùng).
  refreshCron?: string;
  // Bật/tắt cơ chế refresh nền.
  refreshEnabled?: boolean;
  // Schema mô tả fields cho UI/validate custom auth.
  customSchema?: AuthProfileSchema;
}

export interface TlsClientConfig {
  id: string;
  collectionId: string;
  versionId?: string;

  hosts: string[];

  cert?: string;
  key?: string;
  ca?: string;
  passphrase?: string;
}
