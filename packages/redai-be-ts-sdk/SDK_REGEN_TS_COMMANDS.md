# Regenerate SDK (TS mode) from `generic-sdk-api`

## Tool path

Generator tool is located at:

`F:\Redon\sdk\generic-sdk-api`

Repo script already points there:

- `tools/generate-dynamic-table-sdk.ts`
- `toolRoot = 'F:/Redon/sdk/generic-sdk-api'`

## Standard flow (PowerShell)

```powershell
cd F:\Redon\sdk\redai-be-ts-sdk

# 1) Remove old generated source
if (Test-Path src/generated) {
  cmd /c "rmdir /s /q src\generated"
}

# 2) Regenerate in TS mode (from generic-sdk-api)
npm run generate:ts

# 3) Optional: type-check and build
npm run type-check
npm run build
```

## Optional overrides (when needed)

```powershell
# Custom backend root
$env:BACKEND_ROOT="F:/Redon/DuAn/project01/true"

# Custom controllers glob
$env:CONTROLLERS_GLOB="src/modules/dynamic-table/controllers"

# Custom path prefix
$env:PATH_PREFIX="/v1/dynamic-table"

# Then run generate
npm run generate:ts
```

## Quick verification checklist

1. `src/generated` exists again after generation.
2. `tools/.reports/dynamic-table-sdk-report.json` updated.
3. `git status --short` shows expected generated diffs.
4. `npm run type-check` passes.
5. `npm run build` passes.

## Notes

- `generate:ts` command:
  - `cross-env GEN_MODE=ts OUTPUT_REPORT=true tsx tools/generate-dynamic-table-sdk.ts`
- Script writes output into current repo root (`--outDir=${process.cwd()}`), so always run from `redai-be-ts-sdk`.
