import { spawnSync } from 'child_process';
import * as path from 'path';

const toolRoot = 'F:/Redon/sdk/generic-sdk-api';
const cliPath = path.join(toolRoot, 'src', 'cli.ts');

const args = process.argv.slice(2);
const defaults = [
  '--module=dynamic-table',
  `--backendRoot=${process.env.BACKEND_ROOT ?? 'F:/Redon/DuAn/project01/true'}`,
  `--controllersDir=${process.env.CONTROLLERS_GLOB ?? 'src/modules/dynamic-table/controllers'}`,
  `--pathPrefix=${process.env.PATH_PREFIX ?? '/v1/dynamic-table'}`,
  `--outDir=${process.cwd()}`,
];

const result = spawnSync('npx', ['tsx', cliPath, 'verify', ...defaults, ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
