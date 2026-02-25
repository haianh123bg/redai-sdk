# generic-sdk-api

CLI tool to scaffold and generate TypeScript SDKs (axios runtime) from backend APIs.

## Commands

- `create`: scaffold + generate in one command.
- `init`: scaffold SDK project only.
- `generate`: generate/update `src/generated`.
- `verify`: verify generated SDK against backend controllers (TS mode).

## Example

```bash
npx tsx src/cli.ts create \
  --module=dynamic-table \
  --backendRoot=F:/Redon/DuAn/project01/true \
  --outDir=F:/Redon/sdk/redai-be-ts-sdk \
  --controllersDir=src/modules/dynamic-table/controllers \
  --pathPrefix=/v1/dynamic-table \
  --mode=ts
```

