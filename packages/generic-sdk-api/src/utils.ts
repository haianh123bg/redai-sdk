import * as fs from 'fs';
import * as path from 'path';
import { GenMode } from './generator/shared';
import { SdkGenConfig } from './types';

export const parseArgs = (): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const arg of process.argv.slice(3)) {
    if (!arg.startsWith('--')) continue;
    const [key, ...rest] = arg.slice(2).split('=');
    if (!key) continue;
    out[key] = rest.join('=') || 'true';
  }
  return out;
};

export const parseBool = (v: string | undefined, d: boolean): boolean => {
  if (!v) return d;
  return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase());
};

export const loadConfigFile = (cwd: string, cfgPath?: string): Partial<SdkGenConfig> => {
  const filePath = cfgPath ? path.resolve(cwd, cfgPath) : path.resolve(cwd, '.sdkgenrc.json');
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Partial<SdkGenConfig>;
};

export const buildConfig = (cmdArgs: Record<string, string>, defaults?: Partial<SdkGenConfig>): SdkGenConfig => {
  const cwd = process.cwd();
  const configFile = loadConfigFile(cwd, cmdArgs.config);

  const moduleName = cmdArgs.module || defaults?.moduleName || configFile.moduleName || process.env.SDK_MODULE || 'dynamic-table';
  const outDir = path.resolve(cwd, cmdArgs.outDir || defaults?.outDir || configFile.outDir || `F:/Redon/sdk/${moduleName}-sdk`);
  const backendRoot = path.resolve(cwd, cmdArgs.backendRoot || defaults?.backendRoot || configFile.backendRoot || 'F:/Redon/DuAn/project01/true');

  return {
    sdkName: cmdArgs.sdkName || defaults?.sdkName || configFile.sdkName || `${moduleName}-sdk`,
    moduleName,
    outDir,
    backendRoot,
    controllersDir: cmdArgs.controllersDir || defaults?.controllersDir || configFile.controllersDir || `src/modules/${moduleName}/controllers`,
    pathPrefix: cmdArgs.pathPrefix || defaults?.pathPrefix || configFile.pathPrefix || `/v1/${moduleName}`,
    mode: ((cmdArgs.mode || defaults?.mode || configFile.mode || 'ts').toLowerCase() as GenMode),
    openApiSource: cmdArgs.openapi || defaults?.openApiSource || configFile.openApiSource,
    outputReport: parseBool(cmdArgs.outputReport || (defaults?.outputReport ? 'true' : undefined) || (configFile.outputReport ? 'true' : undefined), true),
    syncRootIndex: parseBool(cmdArgs.syncRootIndex || (defaults?.syncRootIndex ? 'true' : undefined) || (configFile.syncRootIndex ? 'true' : undefined), false),
  };
};

export const writeSdkGenConfig = (config: SdkGenConfig): void => {
  const data = {
    sdkName: config.sdkName,
    moduleName: config.moduleName,
    outDir: config.outDir,
    backendRoot: config.backendRoot,
    controllersDir: config.controllersDir,
    pathPrefix: config.pathPrefix,
    mode: config.mode,
    openApiSource: config.openApiSource,
    outputReport: config.outputReport,
    syncRootIndex: config.syncRootIndex,
  };
  fs.writeFileSync(path.join(config.outDir, '.sdkgenrc.json'), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};
