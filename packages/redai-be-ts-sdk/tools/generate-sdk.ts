import { spawnSync } from 'child_process';
import * as path from 'path';

const toolRoot = 'F:/Redon/sdk/generic-sdk-api';
const cliPath = path.join(toolRoot, 'src', 'cli.ts');

const args = process.argv.slice(2);
const result = spawnSync('npx', ['tsx', cliPath, 'generate', ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) process.exit(result.status ?? 1);
