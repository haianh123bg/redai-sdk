# p03-erp-v1-sdk

TypeScript SDK monorepo for Project03 services.

## Workspace Packages

- `packages/dangkykinhdoanh-sdk` - Business registration lookup SDK
- `packages/generic-sdk-api` - CLI tool to scaffold and generate TS SDKs
- `packages/infodoanhnghiep-sdk` - Company information SDK
- `packages/mst-sdk` - Tax code lookup SDK
- `packages/neac-verify-sdk` - NEAC signature verification SDK
- `packages/p03-erp-v1-frontend-sdk` - Frontend integration SDK
- `packages/p03-erp-v1-workflow-engine-sdk` - Workflow engine SDK
- `packages/redai-be-ts-sdk` - RedAI backend dynamic-table SDK
- `packages/sepay-hub-sdk` - SePay Bank Hub SDK
- `packages/timkiemdoanhnghiep-sdk` - Business search SDK
- `packages/tool-custom-sdk` - Tool/OpenAPI/Postman normalization SDK
- `packages/tracuu.vin-hoadon-sdk` - Invoice lookup SDK

## Root Scripts

- `npm run build` - Build all packages that expose a `build` script
- `npm run clean` - Clean build outputs for packages with a `clean` script
- `npm run typecheck` - Run TypeScript checks for packages with a `typecheck` script
- `npm run lint` - Run lint checks for packages with a `lint` script
- `npm run test` - Run tests for packages with a `test` script

## Monorepo Rules For New Packages

- Do not copy nested `.git` directories into `packages/*`.
- Do not commit per-package `node_modules`.
- Do not commit per-package `package-lock.json` in workspace packages.
- Do not copy prebuilt `dist` outputs when importing a package source tree.
