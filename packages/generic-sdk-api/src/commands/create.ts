import { scaffoldSdkBase } from '../sdk-writer';
import { runGenerate } from './generate';
import { buildConfig, parseArgs, writeSdkGenConfig } from '../utils';

export const runCreateFromArgs = async (): Promise<void> => {
  const cfg = buildConfig(parseArgs());
  scaffoldSdkBase(cfg);
  writeSdkGenConfig(cfg);
  await runGenerate(cfg);
  console.log(`Created SDK project at ${cfg.outDir}`);
};

if (require.main === module) {
  runCreateFromArgs().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
