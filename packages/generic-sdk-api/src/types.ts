import { GenMode } from './generator/shared';

export type SdkGenConfig = {
  sdkName: string;
  moduleName: string;
  outDir: string;
  backendRoot: string;
  controllersDir: string;
  pathPrefix: string;
  mode: GenMode;
  openApiSource?: string;
  outputReport: boolean;
  syncRootIndex: boolean;
};
