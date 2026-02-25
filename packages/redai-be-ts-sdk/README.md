# RedAI Dynamic Table SDK

SDK axios cho API `dynamic-table` (backend NestJS).

## Cài đặt

```bash
npm install
```

## Generate

```bash
npm run generate
```

Mặc định generator đọc OpenAPI từ:

`F:\Redon\DuAn\project01\true\src\modules\dynamic-table\tests\curl\docs-json.json`

Có thể override:

```bash
OPENAPI_PATH=path/to/openapi.json npm run generate
```

## Build

```bash
npm run type-check
npm run build
```

## Sử dụng

```ts
import {
  createDynamicTableSdk,
  createFrontendAxiosTokenProvider,
} from '@redonvn/redai-backend-api-sdk';

const sdk = createDynamicTableSdk({
  baseURL: 'https://api.example.com/v1',
  tokenProvider: createFrontendAxiosTokenProvider({
    authStorageKey: 'auth_data',
    dtApiToken: 'dt-api-token',
  }),
});

const res = await sdk.workspaces.getWorkspaceBySlug({ slug: 'my-workspace' });
```

## Import chuẩn (không dùng dist)

```ts
import { WorkspaceResponseDto, WorkspacesService } from '@redonvn/redai-backend-api-sdk';
```

Khi cần deep import theo module generated:

```ts
import type { WorkspaceResponseDto } from '@redonvn/redai-backend-api-sdk/generated/dynamic-table/types';
import { WorkspacesService } from '@redonvn/redai-backend-api-sdk/generated/dynamic-table/services/workspaces.service';
```

## Auth runtime

```ts
sdk.auth.setBearerToken('new-jwt');
sdk.auth.setDtApiToken('new-dt-token');
sdk.auth.setAuth({ bearerToken: null, dtApiToken: null });

// Tắt token provider nếu muốn quay về set token thủ công
sdk.auth.setTokenProvider(null);
```

## Cấu trúc

- `src/core/*`: runtime axios + auth
- `src/generated/types.ts`: types sinh từ OpenAPI
- `src/generated/services/*.service.ts`: service theo domain
- `tools/generate-dynamic-table-sdk.ts`: tool generator
