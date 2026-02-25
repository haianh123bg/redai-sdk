#!/usr/bin/env node
import { runInitFromArgs } from './commands/init';
import { runCreateFromArgs } from './commands/create';
import { runGenerateFromArgs } from './commands/generate';
import { runVerifyFromArgs } from './commands/verify';

const command = process.argv[2] || 'create';
const HELP_COMMANDS = new Set(['-h', '--help', 'help']);

const printUsage = (): void => {
  console.log('Usage: generic-sdk-api <command> [options]');
  console.log('');
  console.log('Commands:');
  console.log('  create    Scaffold and generate an SDK in one step');
  console.log('  init      Scaffold SDK project structure only');
  console.log('  generate  Generate/update src/generated');
  console.log('  verify    Verify generated SDK against backend controllers');
};

const run = async (): Promise<void> => {
  if (HELP_COMMANDS.has(command)) {
    printUsage();
    return;
  }

  switch (command) {
    case 'init':
      await runInitFromArgs();
      return;
    case 'generate':
      await runGenerateFromArgs();
      return;
    case 'verify':
      await runVerifyFromArgs();
      return;
    case 'create':
      await runCreateFromArgs();
      return;
    default:
      throw new Error(`Unknown command: ${command}. Use one of: create | init | generate | verify`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
