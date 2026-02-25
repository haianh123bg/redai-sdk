# Kế hoạch xây dựng SDK Tool-Convert (NestJS/TypeScript)

## 1) Mục tiêu

Xây dựng một SDK (NestJS + TypeScript) để:

- Import/thu thập các mô tả API từ nhiều nguồn (OpenAPI/Swagger, Postman, …).
- Chuyển đổi về một **định dạng chuẩn hoá** (Intermediate Representation – IR).
- Lưu trữ vào database (để truy vấn, versioning, tái sử dụng).
- Sinh ra **JSON Schema/tool schema** phục vụ **LLM tool calling** (OpenAI, Google/Gemini, …).
- Bảo toàn mô tả/metadata (tên hàm, mô tả, tags, examples, auth, …) để agent có thể gọi đúng.
- Lưu đủ cấu trúc request để có thể **execute HTTP request** (tương tự Postman runtime).
- Lưu metadata phục vụ **hiển thị UI kiểu Postman** (folders, ordering, environments/variables, examples, history, …).

## 2) Đầu vào / Đầu ra

### 2.1. Đầu vào

- **OpenAPI 3.x** (YAML/JSON)
- **Postman Collection** (v2.1)
- (Mở rộng sau) Insomnia, HAR, cURL snippet, …

### 2.2. Đầu ra

- Lưu DB:
  - Spec gốc (raw)
  - IR chuẩn hoá
  - Các artifact schema (request/response) và examples
  - Cấu trúc request đủ để execute (url template, headers/query/path/cookies, body, auth, timeout, redirect, ...)
  - Cấu trúc hiển thị UI kiểu Postman (folder tree, ordering, environments/variables, saved examples, history)
- Generator:
  - **OpenAI tool definition** (function/tool schema)
  - **Google/Gemini function declaration**
  - (Tuỳ chọn) JSON Schema chuẩn hoá phục vụ validate

## 3) Chuẩn Schema nội bộ (đã có)

File `schema.md` định nghĩa `Schema` và `SchemaType` để mô tả input/output cho tool calling.

Điểm đáng chú ý:

- Các field kiểu `int64` trong spec đang được biểu diễn bằng **string** (`minItems`, `maxItems`, `minLength`, …).
- Có hỗ trợ `anyOf`, `oneOf`, `allOf`, `not`.
- Có `additionalProperties` để biểu diễn map/dictionary.
- Có `format` cho string (date-time, uuid, email, binary, ...).
- `enum` hỗ trợ nhiều kiểu giá trị (`SchemaValue[]`).

## 4) Kiến trúc tổng thể (pipeline)

### 4.1. Các bước xử lý

1. **Ingest/Import**
   - Parse file/url
   - Validate cơ bản
   - Tính hash để dedupe
2. **Normalize -> IR**
   - Mapping OpenAPI/Postman sang IR chuẩn
   - Chuẩn hoá naming: `toolName` (OpenAPI: `operationId`) và function name
   - Chuẩn hoá schema về interface `Schema`
3. **Persist**
   - Upsert API source/collection/operation
   - Lưu schema + examples
4. **Generate**
   - Từ IR -> tool schema theo target (OpenAI/Google)
   - Tuỳ chọn: xuất JSON Schema để validate runtime
5. **Execute**
   - Execute theo 2 chế độ: gọi API bình thường hoặc execute từ AI Agent (tool call)
   - Resolve biến môi trường + auth + file inputs + policy trước khi gọi HTTP

### 4.2. Nguyên tắc thiết kế

- **IR là canonical**: importer nào cũng phải map về IR trước khi lưu/generate.
- **Repository tách biệt DB**: SDK cung cấp interface repository; có thể cung cấp adapter mặc định (Prisma/TypeORM).
- **Generator theo target**: mỗi provider LLM có rule riêng → tách generator.
- **HTTP engine**: dùng `axios` để execute (hỗ trợ cấu hình `proxy` linh động cho từng app/tenant).

## 5) Data model / Entities (logical)

Tối thiểu cần các khối sau:

- **ApiSource**
  - `id`, `type` (openapi/postman/…), `name`
  - `rawPayload` (JSON/text) hoặc `rawLocation` (path/url)
  - `hash`, `importedAt`, `createdBy`, `tenantId` (nếu có)
- **ApiVersion**
  - `id`, `collectionId`
  - `version` (ví dụ: `v1`, `2025-12-31`, semver, ...)
  - `isDefault`, `status` (active/deprecated), `releasedAt` (tuỳ chọn)
- **ApiCollection**
  - nhóm operations theo app/service
  - quản lý version thông qua `ApiVersion` (mỗi collection có nhiều versions)
- **ApiOperation**
  - `id`, `collectionId`, `versionId`
  - `toolName` (OpenAPI: `operationId`)
  - `method`, `path`, `name` (operationId normalized), `description`, `tags`
  - `requestSchema` (Schema) hoặc cấu trúc chi tiết hơn (params/body)
  - `responseSchemas` (map status code -> Schema)
  - `security` (auth requirements)
- **ApiFolder**
  - `id`, `collectionId`, `versionId`
  - `parentId` (nullable), `name`, `order`
  - dùng để dựng cây hiển thị giống Postman Collection
  - `auth`: cấu hình auth cho folder (xem `AuthConfig`) hoặc kế thừa từ profile mặc định
  - `authRefId` (tuỳ chọn): tham chiếu tới `AuthProfile` dùng chung (collection/version)
  - `authMode`: `inherit|override|none` (tuỳ chọn)
- **RequestDefinition**
  - `id`, `operationId`
  - `baseUrl` (có thể resolve từ server/environment)
  - `urlTemplate` (ví dụ: `{{baseUrl}}/users/{{id}}`)
  - `method`
  - `pathParams`, `queryParams`, `headers`, `cookies` (mỗi item có `key/value/enabled/description`)
  - `auth`: cấu hình auth cho request (xem `AuthConfig`) hoặc kế thừa từ profile mặc định
  - `authRefId` (tuỳ chọn): tham chiếu tới `AuthProfile` dùng chung (collection/version)
  - `authMode`: `inherit|override|none` (tuỳ chọn)
  - `body` (xem `RequestBodyDefinition`)
  - `timeoutMs`, `followRedirects`, `maxRedirects` (tuỳ chọn)
- **RequestBodyDefinition**
  - `mode`:
    - `none`
    - `raw` (json/text/xml/graphql)
    - `urlencoded`
    - `form-data`
    - `multipart` (nếu muốn tách riêng)
    - `binary`
  - `contentType`
  - `rawText` (khi mode=raw)
  - `fields` (khi urlencoded/form-data; field có `key/value/type=text|file/enabled`)
- **AuthConfig**
  - `type`: `none|bearer|basic|apiKey|oauth2|openIdConnect|oauth1|awsSigV4|hawk|digest|ntlm|custom` (tuỳ ưu tiên)
  - `placement`: `header|query|cookie`
  - `headerName`/`queryParamName` (với apiKey)
  - `username/password` (basic)
  - `token` (bearer)
  - `oauth2` (clientId/secret/authUrl/tokenUrl/scopes) (có thể lưu để UI hiển thị; việc tự refresh token là phase sau)
  - `openIdConnectUrl` (openIdConnect) (tuỳ chọn: lưu discovery url; token vẫn thường dùng bearer)
  - `oauth1` (consumerKey/consumerSecret/token/tokenSecret/signatureMethod/realm/...) (có thể lưu để UI hiển thị)
  - `awsSigV4` (accessKeyId/secretAccessKey/sessionToken/region/service) (có thể lưu để UI hiển thị)
  - `custom` (tuỳ chọn): lưu cấu hình mở rộng nếu gặp loại auth riêng của hệ thống
- **AuthProfile**
  - `id`, `collectionId`, `versionId` (tuỳ chọn)
  - `name`, `isDefault`, `enabled`
  - `config: AuthConfig`
  - giá trị trong `config` nên ưu tiên dùng biến `Environment` (ví dụ `token: "{{ACCESS_TOKEN}}"`) để không hardcode secret
- **TlsClientConfig** (tuỳ chọn)
  - phục vụ trường hợp Postman Certificates / mTLS khi execute
  - `id`, `collectionId`, `versionId` (tuỳ chọn)
  - `hosts[]` (pattern/hostname)
  - `cert`/`key`/`ca` (ưu tiên tham chiếu secret/env/secret-store, tránh lưu plaintext)
  - `passphrase` (nếu có)
- **Environment**
  - `id`, `collectionId` (hoặc `projectId/tenantId`)
  - `name`, `variables[]` (key/value/enabled/isSecret)
  - dùng để resolve `{{var}}` khi execute
- **RequestExample**
  - `id`, `operationId`
  - `name`, `requestSnapshot` (headers/query/body/auth đã resolve hoặc chưa resolve)
  - hỗ trợ UI “Examples” như Postman
- **ResponseExample/History** (tuỳ chọn)
  - `id`, `operationId`
  - `status`, `headers`, `body`, `durationMs`, `createdAt`
  - phục vụ UI history + debug
- **SchemaArtifact** (tuỳ chọn)
  - lưu schema dùng lại, có hash để dedupe
- **ExampleArtifact** (tuỳ chọn)
  - request/response examples

### 5.1. Quy ước quản lý phiên bản API

- Mỗi `ApiCollection` có thể có nhiều `ApiVersion` (ví dụ `v1`, `v2`).
- Mọi `ApiOperation` phải gắn `versionId` để truy vấn/generate đúng phiên bản.
- Dedupe/import nên sử dụng khoá có version (ví dụ: `${version}:${method} ${path}` hoặc `${version}:${operationId}`).
- Với tool calling, `toolName` cần **ổn định theo thời gian**; nếu bạn muốn xuất nhiều version song song, cân nhắc quy ước:
  - `toolName = ${version}__${operationId}` (tuỳ chọn)
  - hoặc giữ `toolName = operationId` và dùng routing theo version ở layer repository/query.

### 5.3. Quy ước đặt `toolName` và xử lý trùng `operationId`

- Với OpenAPI, mặc định `toolName = operationId`.
- Nếu phát hiện trùng `operationId` trong cùng phạm vi (collection + version), SDK sẽ rename bằng hậu tố để đảm bảo duy nhất, ví dụ:
  - `getUser`
  - `getUser__2`
  - `getUser__3`
- Quy tắc rename này phải **deterministic** (cùng input -> cùng output) để tránh toolName thay đổi giữa các lần import.

### 5.4. Thiết kế Auth dùng chung (collection/version) và cơ chế inject

Thực tế đa số hệ thống có auth dùng chung (bearer/apiKey/basic/...) cho toàn bộ service. Vì vậy, kế hoạch cần coi auth là một cấu hình có thể **kế thừa**.

#### 5.4.1. Cấp độ áp dụng (precedence)

Khi execute một request, auth được resolve theo thứ tự ưu tiên:

1. `RequestDefinition.authMode = none` => không áp auth
2. `RequestDefinition.authMode = override` + `RequestDefinition.auth` => dùng auth của request
3. `RequestDefinition.authMode = inherit` + `RequestDefinition.authRefId` => dùng `AuthProfile` được chỉ định
4. Nếu request không override, cho phép kế thừa auth từ folder (giống Postman):
   - `ApiFolder.authMode = none` => không áp auth
   - `ApiFolder.authMode = override` + `ApiFolder.auth` => dùng auth của folder
   - `ApiFolder.authMode = inherit` + `ApiFolder.authRefId` => dùng `AuthProfile` được chỉ định
5. Nếu không có request/folder override, dùng `AuthProfile.isDefault = true` ở cấp version (nếu có), rồi đến default ở cấp collection

#### 5.4.2. Quy tắc inject auth vào request

- Nếu `placement = header`:
  - bearer: set `Authorization: Bearer <token>`
  - basic: set `Authorization: Basic <base64(username:password)>`
  - apiKey: set `<headerName>: <value>`
- oauth1: set `Authorization: OAuth ...` (ký theo OAuth 1.0) hoặc theo placement tương ứng
- awsSigV4: ký request (canonical request) và set header `Authorization` + `X-Amz-Date` (+ `X-Amz-Security-Token` nếu có)
- Nếu `placement = query`: thêm query param tương ứng
- Nếu `placement = cookie`: thêm cookie tương ứng

Nguyên tắc:

- Auth injection diễn ra **sau khi resolve variables** từ `Environment`.
- Không cho phép auth injection ghi đè các header hệ thống bị cấm (tuỳ policy: `Host`, `Content-Length`, ...).
- Không đưa secret vào tool schema.

#### 5.4.3. Khác biệt Direct execute vs Agent execute liên quan auth

- **Direct**: backend/app có thể truyền `authMode/authRefId` trực tiếp, hoặc set default profile theo environment.
- **Agent**:
  - Tool args chỉ nên chứa thông tin **tham chiếu** (ví dụ `environmentId`, `authProfileId`), không chứa token/secret.
  - Logs/audit phải mask secret (ví dụ header `Authorization`).
  - Policy có thể giới hạn agent chỉ được dùng một số `AuthProfile` nhất định.

### 5.5. Auth masking & agent allowlist

Mục tiêu: đảm bảo không rò rỉ secret khi log/audit/trace, và hạn chế Agent chỉ có thể dùng auth đã được cấp quyền.

#### 5.5.1. Masking quy chuẩn (logs/audit/history)

- Mask các header nhạy cảm (tuỳ policy):
  - `Authorization`
  - `Proxy-Authorization`
  - `Cookie`
  - `Set-Cookie`
  - các header apiKey theo `AuthConfig.headerName` (ví dụ `X-API-KEY`) nếu có
- Mask các env variables có `isSecret = true` khi:
  - ghi log
  - lưu history
  - trả kết quả về agent
- Khi lưu `requestSnapshot`/`audit`, lưu 2 bản (tuỳ chọn):
  - `sanitizedSnapshot` (đã mask) để hiển thị/log
  - `rawSnapshotRef` (tham chiếu nội bộ, có kiểm soát quyền) nếu cần debug sâu

#### 5.5.2. Agent allowlist cho AuthProfile

- `ExecutionContext.policy` nên có (ít nhất):
  - `allowedAuthProfileIds[]`
  - `allowedEnvironmentIds[]`
  - `allowedHosts[]` (outbound allowlist)
- Khi `mode=agent`, backend SDK chỉ cho phép execute nếu:
  - `authProfileId` nằm trong allowlist (hoặc default profile nằm trong allowlist)
  - `environmentId` nằm trong allowlist

#### 5.5.3. Nguyên tắc tool schema đối với auth

- Tool schema không bao giờ nhận trực tiếp `token/password/clientSecret`.
- Tool schema chỉ nhận tham chiếu (`authProfileId`, `environmentId`) hoặc các field không nhạy cảm.

### 5.2. Yêu cầu để hiển thị UI kiểu Postman

- Có **cấu trúc cây**: folder -> request (ApiFolder + order).
- Có **environments/variables** và cơ chế bật/tắt từng biến.
- Có **request body mode** (raw/urlencoded/form-data/file) + content-type.
- Có **auth config** độc lập từng request và/hoặc kế thừa từ collection.
- Có **examples/history** để user xem lại.

## 6) IR đề xuất (cấp độ module)

### 6.1. IR cho Operation

- `operationKey`: khoá dedupe (nên bao gồm version)
- `version`: phiên bản API (ví dụ `v1`/`v2`)
- `method`, `path`, `servers/baseUrl` (nếu có)
- `toolName`: tên tool để generate tool definition (OpenAPI: `operationId`)
- `name`, `summary`, `description`, `tags`
- `parameters`:
  - `path/query/header/cookie`: mỗi param có `name`, `required`, `schema: Schema`, `description`, `example`
- `requestBody`:
  - theo content-type (`application/json`, `multipart/form-data`, …)
  - `schema: Schema`, `examples`
- `responses`:
  - status code -> content-type -> `schema: Schema` + `examples`
- `security`:
  - bearer/apiKey/oauth2 (tối thiểu lưu được type + nơi đặt + tên header)

### 6.3. IR cho Execute (request runtime)

Ngoài schema dùng cho tool calling, IR cần giữ đủ thông tin để có thể build một HTTP request hoàn chỉnh:

- `request.urlTemplate`
- `request.method`
- `request.headers/query/cookies/pathParams` (có enable/disable)
- `request.body` (mode + contentType + rawText/fields/files)
- `request.auth` (apply vào header/query/cookie)
- `request.settings` (timeout, redirects)

Khi build request để execute, executor cần:

- Resolve `Environment` variables trong url/headers/query/body/auth
- Resolve auth theo `authMode` + `authRefId`/default profile
- Apply auth injection theo `AuthConfig.placement`

IR execute này có thể được lưu dưới dạng `RequestDefinition` để phục vụ cả:

- Generator tool-call (biết endpoint cần gì)
- Executor runtime (thực thi request)
- UI renderer (hiển thị giống Postman)

### 6.4. IR cho LLM Tool Call (Agent Execution)

Mục tiêu phần này là mô tả rõ vòng đời:

1. Từ dữ liệu đã chuẩn hoá (IR + config) -> build **tool definition** + **schema** gửi cho LLM
2. LLM trả về **tool call arguments** theo schema
3. Backend SDK validate/normalize arguments -> build HTTP request -> execute
4. Lưu audit/log/history và trả kết quả về agent

Đề xuất các khối dữ liệu (logical) liên quan tới Agent execution:

- **ToolDefinitionArtifact**
  - `id`, `target` (openai/google)
  - `toolName`
  - `parametersSchema: Schema`
  - `operationId`/`operationKey`/`version`
- **ToolCallEnvelope**
  - `toolName`
  - `arguments` (object theo `parametersSchema`)
  - `raw` (payload thô LLM trả về để debug)
- **ExecutionContext**
  - `mode`: `agent` | `direct`
  - `environmentId` (hoặc inline env)
  - `actor`: `userId/agentId`
  - `policy` (rate limit, allowlist host, timeout, max response size, ...)
  - `traceId`/`correlationId`

Phân biệt 2 chế độ execute:

- **Direct execute (call API bình thường)**
  - Input thường là `RequestDefinition` + env + auth (đã được app/backend xác định)
  - Ít ràng buộc hơn về “schema tool call”, nhưng vẫn có validate và logging.
- **Agent execute (execute từ AI Agent/LLM)**
  - Input là `ToolCallEnvelope` (toolName + args) -> map sang `ApiOperation` -> build request
  - Bắt buộc validate theo `Schema` (tool input schema) trước khi gọi HTTP
  - Áp policy nghiêm ngặt hơn: allowlist host, hạn chế header nhạy cảm, giới hạn kích thước payload/response, audit đầy đủ.

#### 6.4.1. Xử lý input kiểu file trong Agent execution (file-by-URL)

Do tool calling không phù hợp để truyền binary lớn, với các field dạng file (multipart/binary), Agent sẽ gửi **URL** thay cho file content.

Quy ước đề xuất:

- Với field kiểu file, tool args dùng object dạng:
  - `{ "url": "https://...", "filename": "a.png" }` (hoặc chỉ `url`)
- Backend SDK sẽ:
  - Tải file từ URL theo chế độ **stream trực tiếp**
  - Kiểm tra policy (allowlist domain, content-type, max size, timeout)
  - Stream trực tiếp vào multipart/binary body (hạn chế lưu trữ)
  - Build request multipart/binary để gọi API đích

Lưu ý an toàn (nên có trong policy):

- Chỉ cho phép scheme `https` (tuỳ chọn cho `http` nội bộ)
- Allowlist hostname hoặc blocklist private network (SSRF)
- Giới hạn dung lượng, timeout, số lần redirect
- Không forward cookie/header từ agent sang URL tải file

Kết quả execute nên trả về:

- `status`, `headers` (đã lọc), `body` (có truncate), `durationMs`
- `artifacts` (ví dụ: file upload ids) nếu API trả về
- `audit` (toolName, args đã normalize, resolved env, request snapshot)

### 6.2. Quy ước “tool input schema”

Tool schema thường cần 1 object root để agent dễ gọi:

- root `type: object`
- `properties`:
  - `path`: object path params
  - `query`: object query params
  - `headers`: object headers (cẩn thận auth)
  - `body`: request body schema
- `required` suy ra từ param required + body required

## 7) Kiến trúc SDK NestJS để publish npm

### 7.1. Module public

- `ToolCustomSdkModule.register(config)` (DynamicModule)

### 7.2. Providers/Services

- `ImporterRegistry`
  - `OpenApiImporter`
  - `PostmanImporter`
- `NormalizerService`
  - chuyển importer output -> IR chuẩn
- `GeneratorRegistry`
  - `OpenAiToolGenerator`
  - `GoogleToolGenerator`
- `ApiRepository` (interface)
  - adapter theo Prisma/TypeORM/Mongo (tuỳ chọn)

### 7.3. API (public methods) đề xuất

- `importOpenApi(input)`
- `importPostman(input)`
- `listOperations(filter)`
- `getToolDefinition(target, operationId|operationKey)`
- `executeOperation(operationId|operationKey, input, context)` (direct)
- `executeToolCall(target, toolCallEnvelope, context)` (agent)

## 8) Milestones / Deliverables

### Milestone 1 — Spec & IR

- Chốt IR types
- Chốt mapping OpenAPI/Postman -> IR
- Chốt repository interface

### Milestone 2 — OpenAPI importer

- Parse OpenAPI 3.x
- Map schema -> `Schema`
- Persist vào repository

### Milestone 3 — Postman importer

- Parse collection v2.1
- Map request/response/example sang IR
- Persist

### Milestone 4 — Generators

- OpenAI tool schema generator
- Google tool schema generator
- Unit tests cho các mapping case phổ biến

### Milestone 5 — Publish

- Build/packaging (`tsup`/`tsc`)
- `package.json` exports
- Basic docs (README)

## 9) Test strategy

- Unit tests cho mapping schema (primitive/object/array/nullable/anyOf/enum)
- Fixture tests với sample OpenAPI/Postman
- Snapshot tests cho tool schema output
- Fixture tests cho đủ loại request body (raw json/text, urlencoded, form-data có file, binary)
- Tests cho variable resolution `{{var}}` + auth injection (bearer/apiKey/basic)
- Tests cho agent tool-call flow: schema validate -> args normalize -> execute
- Tests cho file-by-URL: download/stream, policy (size/type/allowlist), multipart build

## 10) Các quyết định cần bạn chốt (blocking)

- DB target: Postgres hay Mongo? Dùng Prisma hay TypeORM?
- Multi-tenant có cần không?
- Versioning API: quản lý bằng entity `ApiVersion` riêng hay chỉ dùng field `version` trên `ApiOperation`?
- Tool strategy: mỗi endpoint = 1 tool hay gom nhiều endpoint vào 1 tool router?
- Enum: có cần hỗ trợ enum number/bool không (hiện `enum: string[]`)?

## 0) Legacy Cleanup Status (2026-02-16)

- Clean break da hoan tat cho SDK stateless.
- Da xoa toan bo legacy persistence/Nest integration path khoi `src`.
- Public API hop le con lai chi la stateless importers/generators/executor/facade/types qua `src/index.ts`.
- Cac script deprecated sqlite/nestjs legacy test da duoc loai bo.
