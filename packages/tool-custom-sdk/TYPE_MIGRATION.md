# TYPE_MIGRATION.md

## Muc tieu
Tai lieu nay ghi lai cac thay doi type-level va clean break sau khi dua SDK ve stateless-only.

## Breaking changes (clean break)
1. Da xoa hoan toan cac legacy paths:
   - `src/repositories/*`
   - `src/entities/*`
   - `src/migrations/*`
   - `src/tool-custom-sdk.module.ts`
   - `src/tool-custom-sdk.service.ts`
   - `src/config.ts`
   - `src/tokens.ts`
   - `src/tools/openapi-sqlite-test.ts`
   - `src/tools/openapi-nestjs-sqlite-test.ts`
2. Khong con ho tro deep import vao cac path legacy neu consumer dang dung truc tiep.
3. Public surface hop le duy nhat la export tu `src/index.ts`.

## Public stateless APIs duoc giu
1. Importers:
   - `OpenApiImporter`
   - `PostmanImporter`
2. Generators:
   - `generateOpenAiToolDefinition`
   - `generateGoogleFunctionDeclaration`
3. Executor:
   - `AxiosExecutor`
4. Facade:
   - `normalizeImportedOperations(...)`
   - `buildToolDefinitions(...)`
   - `executeFromOperation(...)`
5. Types:
   - `schema`, `auth`, `ir`, `execution`, `workflow`

## Type safety tightening
1. `exactOptionalPropertyTypes` da bat.
2. Pattern optional duoc chuan hoa theo huong omit undefined.
3. Khong su dung `any` tren production source path.

## Huong dan migrate cho consumer
1. Neu dang import tu path legacy, doi sang import tu package root:
   - `import { ... } from 'tool-custom-sdk'`
2. Chuan hoa payload input theo type hien tai:
   - `ToolArgumentsEnvelope`
   - `AuthConfig`
   - `RequestDefinition`
3. Chay `typecheck` tren project consumer de bat mismatch som.
