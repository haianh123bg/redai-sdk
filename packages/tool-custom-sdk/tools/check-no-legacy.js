const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const blockedPaths = [
  'src/repositories',
  'src/entities',
  'src/migrations',
  'src/tool-custom-sdk.module.ts',
  'src/tool-custom-sdk.service.ts',
  'src/config.ts',
  'src/tokens.ts',
  'src/tools/openapi-sqlite-test.ts',
  'src/tools/openapi-nestjs-sqlite-test.ts',
];

const existing = blockedPaths.filter((relPath) => fs.existsSync(path.join(ROOT, relPath)));

if (existing.length > 0) {
  console.error('Legacy paths detected:');
  for (const relPath of existing) {
    console.error(`- ${relPath}`);
  }
  process.exit(1);
}

console.log('No legacy paths detected.');
