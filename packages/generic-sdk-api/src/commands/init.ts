import { scaffoldSdkBase } from '../sdk-writer';
import { buildConfig, parseArgs, writeSdkGenConfig } from '../utils';

export const runInitFromArgs = async (): Promise<void> => {
  const cfg = buildConfig(parseArgs());
  scaffoldSdkBase(cfg);
  writeSdkGenConfig(cfg);
  console.log(`Initialized SDK scaffold at ${cfg.outDir}`);
};

if (require.main === module) {
  runInitFromArgs().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
