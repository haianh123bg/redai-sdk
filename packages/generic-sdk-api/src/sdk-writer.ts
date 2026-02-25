import * as fs from 'fs';
import * as path from 'path';
import { SdkGenConfig } from './types';

const ensureDir = (dir: string): void => {
  fs.mkdirSync(dir, { recursive: true });
};

const write = (filePath: string, content: string): void => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
};

const CORE_TYPES_TEMPLATE = `export type Nullable<T> = T | null;

export interface ApiResponseDto<T> {
  code: number;
  message: string;
  result: T;
}

export type MaybePromise<T> = T | Promise<T>;

export interface DynamicTableTokenProvider {
  getBearerToken?: () => MaybePromise<string | null | undefined>;
  getDtApiToken?: () => MaybePromise<string | null | undefined>;
}

export interface DynamicTableSdkConfig {
  baseURL: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  bearerToken?: string | null;
  dtApiToken?: string | null;
  tokenProvider?: DynamicTableTokenProvider;
}
`;

const CORE_AUTH_TEMPLATE = `import { DynamicTableTokenProvider } from './types';

export interface AuthState {
  bearerToken: string | null;
  dtApiToken: string | null;
}

export class DynamicTableAuth {
  private state: AuthState;
  private tokenProvider: DynamicTableTokenProvider | null = null;

  constructor(initial?: Partial<AuthState>, tokenProvider?: DynamicTableTokenProvider) {
    this.state = { bearerToken: initial?.bearerToken ?? null, dtApiToken: initial?.dtApiToken ?? null };
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

  setBearerToken(token: string | null): void { this.state.bearerToken = token; }
  setDtApiToken(token: string | null): void { this.state.dtApiToken = token; }
  setAuth(input: { bearerToken?: string | null; dtApiToken?: string | null }): void {
    if (Object.prototype.hasOwnProperty.call(input, 'bearerToken')) this.state.bearerToken = input.bearerToken ?? null;
    if (Object.prototype.hasOwnProperty.call(input, 'dtApiToken')) this.state.dtApiToken = input.dtApiToken ?? null;
  }
}
`;

const CORE_HTTP_TEMPLATE = `import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { DynamicTableAuth } from './auth';
import { DynamicTableSdkConfig } from './types';

export class HttpClient {
  private readonly instance: AxiosInstance;

  constructor(config: DynamicTableSdkConfig, private readonly auth: DynamicTableAuth) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: { 'Content-Type': 'application/json', ...(config.defaultHeaders ?? {}) },
    });
    this.instance.interceptors.request.use(async (requestConfig) => {
      const state = await this.auth.resolveState();
      if (state.bearerToken) requestConfig.headers.Authorization = \`Bearer \${state.bearerToken}\`;
      else if (requestConfig.headers.Authorization) delete requestConfig.headers.Authorization;
      if (state.dtApiToken) requestConfig.headers['x-dt-api-token'] = state.dtApiToken;
      else if (requestConfig.headers['x-dt-api-token']) delete requestConfig.headers['x-dt-api-token'];
      return requestConfig;
    });
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<T>(config);
    return response.data;
  }
}
`;

export const scaffoldSdkBase = (cfg: SdkGenConfig): void => {
  ensureDir(cfg.outDir);
  ensureDir(path.join(cfg.outDir, 'src', 'core'));
  ensureDir(path.join(cfg.outDir, 'src', 'generated'));
  ensureDir(path.join(cfg.outDir, 'tools'));

  const packageJson = {
    name: cfg.sdkName,
    version: '0.1.0',
    private: true,
    description: `Generated SDK for ${cfg.moduleName}`,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    files: ['dist'],
    scripts: {
      generate: 'generic-sdk-api generate --config .sdkgenrc.json',
      'generate:ts': 'generic-sdk-api generate --config .sdkgenrc.json --mode=ts',
      'generate:openapi': 'generic-sdk-api generate --config .sdkgenrc.json --mode=openapi',
      'verify:generated': 'generic-sdk-api verify --config .sdkgenrc.json',
      'type-check': 'tsc --noEmit',
      build: 'tsc -p tsconfig.json',
      prepublishOnly: 'npm run verify:generated && npm run type-check && npm run build',
    },
    dependencies: {
      axios: '^1.9.0',
    },
    devDependencies: {
      '@types/node': '^24.9.0',
      typescript: '^5.8.3',
    },
  };

  write(path.join(cfg.outDir, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
  write(
    path.join(cfg.outDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'CommonJS',
          moduleResolution: 'node',
          lib: ['ES2020'],
          declaration: true,
          outDir: 'dist',
          rootDir: 'src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          types: ['node'],
        },
        include: ['src/**/*.ts'],
        exclude: ['dist', 'node_modules'],
      },
      null,
      2,
    )}\n`,
  );

  write(path.join(cfg.outDir, 'README.md'), `# ${cfg.sdkName}\n\nGenerated by generic-sdk-api.\n`);
  write(path.join(cfg.outDir, '.gitignore'), 'node_modules\ndist\n');

  write(path.join(cfg.outDir, 'src', 'core', 'types.ts'), CORE_TYPES_TEMPLATE);
  write(path.join(cfg.outDir, 'src', 'core', 'auth.ts'), CORE_AUTH_TEMPLATE);
  write(path.join(cfg.outDir, 'src', 'core', 'http-client.ts'), CORE_HTTP_TEMPLATE);

  write(path.join(cfg.outDir, 'src', 'index.ts'), "export * from './core/types';\nexport * from './generated';\n");
};
