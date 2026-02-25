import { DynamicTableTokenProvider } from './types';

export interface AuthState {
  bearerToken: string | null;
  dtApiToken: string | null;
}

export class DynamicTableAuth {
  private state: AuthState;
  private tokenProvider: DynamicTableTokenProvider | null = null;

  constructor(initial?: Partial<AuthState>, tokenProvider?: DynamicTableTokenProvider) {
    this.state = {
      bearerToken: initial?.bearerToken ?? null,
      dtApiToken: initial?.dtApiToken ?? null,
    };
    this.tokenProvider = tokenProvider ?? null;
  }

  async resolveState(): Promise<Readonly<AuthState>> {
    if (!this.tokenProvider) return this.state;

    const [providerBearer, providerDtApiToken] = await Promise.all([
      this.tokenProvider.getBearerToken?.(),
      this.tokenProvider.getDtApiToken?.(),
    ]);

    return {
      bearerToken: providerBearer === undefined ? this.state.bearerToken : (providerBearer ?? null),
      dtApiToken: providerDtApiToken === undefined ? this.state.dtApiToken : (providerDtApiToken ?? null),
    };
  }

  setBearerToken(token: string | null): void {
    this.state.bearerToken = token;
  }

  setDtApiToken(token: string | null): void {
    this.state.dtApiToken = token;
  }

  setAuth(input: { bearerToken?: string | null; dtApiToken?: string | null }): void {
    if (Object.prototype.hasOwnProperty.call(input, 'bearerToken')) {
      this.state.bearerToken = input.bearerToken ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(input, 'dtApiToken')) {
      this.state.dtApiToken = input.dtApiToken ?? null;
    }
  }
}
