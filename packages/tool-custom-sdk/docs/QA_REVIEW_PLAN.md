# Kế hoạch QA rà soát luồng & chức năng SDK

## 🎯 Mục tiêu
- Xác nhận luồng import -> repo -> tool schema -> execute hoạt động đầy đủ, nhất quán.
- Đảm bảo các chức năng/biên lỗi được handle đầy đủ, chi tiết.
- Kiểm tra tính hiện đại: bảo mật, policy, khả năng mở rộng, quan sát (logs/trace), độ tin cậy.

## 🧭 Phạm vi
- Importers: OpenAPI, Postman
- IR & Schema mapping
- Repository: In-memory, Postgres (TypeORM)
- Tool generators: OpenAI/Google
- Executor: HTTP, body, auth, policy, masking
- Module/Service wiring (NestJS)
- Docs & DX (usability, cấu hình)

## 🧪 Chiến lược test
- Unit: mapping, validation, schema convert
- Integration: end-to-end import -> repo -> tool -> execute
- Negative: input lỗi, thiếu auth, policy block
- Regression: behavior cũ không bị phá
- Security: secret leakage, allowlist, file download

## ✅ Ma trận kiểm thử chi tiết

### 1) OpenAPI Importer
- Parse JSON/YAML hợp lệ/không hợp lệ.
- Missing fields: openapi/swagger, paths.
- Params: path/query/header/cookie đầy đủ; required/optional.
- RequestBody: json/multipart/urlencoded; required flag.
- Components $ref: deref đúng, nested ref.
- Tool name collision: ensureUniqueToolName.
- Response mapping: status code + default, content-type ưu tiên.

### 2) Postman Importer
- Folder nesting, order, parentId.
- Auth: collection, folder override, request override.
- Env variables: enabled/disabled.
- Body modes: raw/urlencoded/formdata/file.
- Tool name normalize + unique.
- File URL refs.

### 3) IR & Schema
- Schema: nullable, enum, oneOf/anyOf/allOf.
- Schema to JSON Schema: nullable -> type union.
- RequestDefinition: urlTemplate, headers/query/path/cookies.
- ResponseDefinition: status/description/schema.

### 4) Repository In-memory
- Upsert/get/list ops/folders/auth/env.
- Filter: collectionId/versionId/tag.
- ToolName scope unique.

### 5) Repository Postgres (TypeORM)
- DataSource init, entity mapping.
- Save/Find/QueryBuilder filters.
- JSONB fields: schema, requestDefinition, responses.
- Schema mismatch handling (schema option vs DataSource).
- Index/unique constraint validity.
- Migration chạy được, đúng thứ tự.

### 6) Tool Generators
- OpenAI: function name/description/parameters.
- Google: name/description/parameters.
- Schema conversion edge cases (nullable/enum).

### 7) Executor (HTTP)
- Path/query/header/cookies resolution (env + args).
- Body: raw/json/urlencoded/multipart/binary.
- File download allowlist.
- Redirect, timeout, max response bytes.
- Masking headers agent mode.

### 8) Auth runtime
- none/bearer/basic/apiKey/custom.
- oauth2: client_credentials + authorization_code (PKCE) + refresh_token + password (ROPC).
- openIdConnect: tokenUrl/openIdConnectUrl.
- oauth1: HMAC-SHA1/RSA-SHA1/PLAINTEXT.
- awsSigV4: signature correctness; sessionToken.
- hawk: mac/hash; content-type changes.
- digest: realm/nonce required.
- ntlm: require authorization token.

### 9) Policy
- allowedHosts block/allow.
- allowedFileHosts block/allow.
- allowedAuthProfileIds block/allow.
- allowedEnvironmentIds block/allow.

### 10) DX / Docs
- README hướng dẫn setup (typeorm + entities + reflect-metadata).
- Schema SQL/migration tồn tại, khớp entity.
- Ví dụ usage: import -> execute.

## 🏁 Tiêu chí hoàn thành
- 100% critical flows có test pass.
- Không có lỗi bảo mật hiển nhiên (secret leak, bypass allowlist).
- Docs đủ để setup dự án mới trong <=30 phút.

## 📌 Kết quả mong muốn
- Checklist pass/fail cho từng mục.
- Danh sách gap/issue, mức độ ưu tiên, đề xuất fix.

---

# Báo cáo rà soát (theo code hiện tại)

## 📊 Tóm tắt nhanh
- ✅ Pass: 7
- 🟡 Partial: 6
- ❌ Fail: 1
- ⚪ Not verified: 0 (đã rà soát theo source, chưa chạy test runtime)

## 🧾 Checklist pass/partial/fail

### 1) OpenAPI Importer
- ✅ Parse JSON/YAML, validate openapi/swagger, paths
- ✅ Params path/query/header/cookie
- ✅ RequestBody json/multipart/urlencoded
- ✅ $ref deref cơ bản
- ✅ Response mapping status/default + content-type ưu tiên
- 🟡 Gap: Không map response headers, không xử lý multiple content-types đầy đủ

### 2) Postman Importer
- ✅ Folder nesting/order/parent
- ✅ Auth collection/folder/request
- ✅ Env variables enabled/disabled
- ✅ Body raw/urlencoded/formdata/file
- ✅ Tool name normalize + unique
- 🟡 Gap: Không map cookie params riêng (Postman cookie), không map response

### 3) IR & Schema
- ✅ Schema nullable/enum/oneOf/anyOf/allOf/not
- ✅ Schema to JSON Schema
- ✅ RequestDefinition: urlTemplate + headers/query/path/cookies
- ✅ ResponseDefinition: status/description/schema

### 4) Repository In-memory
- ✅ CRUD ops/folders/auth/env
- ✅ Filter collectionId/versionId/tag

### 5) Repository Postgres (TypeORM)
- ✅ Entity mapping + JSONB fields
- ✅ Save + typing an toàn cho JSONB
- ✅ QueryBuilder filters + tag filter
- 🟡 Gap: Chưa có test cho schema khác public

### 6) Tool Generators
- ✅ OpenAI/Google basic schema
- ✅ Edge cases (nullable/enum) phụ thuộc schema-to-jsonschema

### 7) Executor (HTTP)
- ✅ Path/query/header/cookies merge
- ✅ Body raw/urlencoded/multipart/binary
- ✅ Allowlist host/filehost
- ✅ Masking headers agent mode
- 🟡 Gap: Không validate response schema, không parse JSON theo content-type

### 8) Auth runtime
- ✅ none/bearer/basic/apiKey/custom
- ✅ oauth2 (client_credentials + authorization_code/PKCE + refresh_token + password)
- ✅ openIdConnect (tokenUrl/openIdConnectUrl)
- 🟡 oauth1/HMAC/RSA/PLAINTEXT (chưa có test)
- 🟡 awsSigV4 (chưa test canonical headers + signed headers)
- 🟡 hawk (chưa test payload hash)
- 🟡 digest (cần realm/nonce từ trước, chưa có challenge flow)
- ❌ ntlm (chưa có handshake, chỉ nhận authorization sẵn)

### 9) Policy
- ✅ allowedHosts/allowedFileHosts
- ✅ allowedAuthProfileIds/allowedEnvironmentIds
- 🟡 Gap: Không có audit log cho policy quyết định

### 10) DX / Docs
- 🟡 README hướng dẫn TypeORM + entities + reflect-metadata (có ví dụ trong ARCHITECTURE, chưa có README riêng)
- ✅ Schema SQL có sẵn
- 🟡 Gap: Chưa có hướng dẫn migration/seed

## 🔥 Vấn đề cần xử lý (ưu tiên)
1) ❌ NTLM chưa có handshake.
2) 🟡 Digest auth thiếu challenge/realm/nonce automation.
3) 🟡 Executor chưa validate response schema.
4) 🟡 Thiếu audit log cho policy.
5) 🟡 Thiếu hướng dẫn migration/seed trong docs.

## 💡 Khuyến nghị triển khai
- Bổ sung test integration cho OpenAPI/Postman và auth flows.
- Thêm response validation dựa trên ResponseDefinition (nếu bật).
- Viết tài liệu migration/seed cho TypeORM.

---

# Câu hỏi làm rõ trước khi triển khai fix

## 1) NTLM handshake
Bạn muốn xử lý NTLM theo hướng nào?
- A) Thêm NTLM handshake đầy đủ (Type1/Type3) bằng thư viện ngoài
- B) Chỉ hỗ trợ authorization token có sẵn (giữ như hiện tại) ✅
- C) Tắt NTLM khỏi runtime (throw lỗi rõ ràng)
- D) Hoãn triển khai NTLM, chỉ document

## 2) OAuth2 flows
Ngoài `client_credentials`, cần thêm flow nào?
- A) Thêm refresh_token + auto refresh
- B) Thêm authorization_code (PKCE)
- C) Thêm password (ROPC)
- D) Cả B + C ✅

## 3) Digest auth challenge
Xử lý challenge như thế nào?
- A) Tự động đọc WWW-Authenticate và retry
- B) Yêu cầu truyền sẵn realm/nonce (giữ như hiện tại) ✅
- C) Tắt digest trong runtime
- D) Hoãn, chỉ document

## 4) AWS SigV4 testing
Bạn muốn test/validate SigV4 ở mức nào?
- A) Viết unit tests với dữ liệu chuẩn (AWS examples)
- B) Viết integration test gọi AWS (requires credentials)
- C) Chỉ review code, không test ✅
- D) Loại bỏ SigV4 nếu chưa dùng

## 5) Response validation
Muốn validate response như thế nào?
- A) Validate strict theo ResponseDefinition
- B) Validate schema nhưng chỉ warn
- C) Chỉ lưu schema để docs, không validate
- D) Tắt hoàn toàn ✅

## 6) TypeORM upsert JSONB typing
Chọn hướng xử lý type safety?
- A) Chuyển sang `save()` + explicit entity typing ✅
- B) Giữ `upsert` nhưng cast rõ (`as DeepPartial`)
- C) Dùng custom repo + raw query
- D) Giữ `as any` (không sửa)

## 7) Encoding tiếng Việt
Xử lý các string bị lỗi encoding trong source?
- A) Chuẩn hóa toàn bộ sang UTF-8 (sửa trực tiếp source) ✅
- B) Chỉ sửa thông báo lỗi public-facing
- C) Hoãn, chỉ document
- D) Bỏ tiếng Việt, chuyển sang English

## 8) TypeORM migration
Bạn muốn quản lý schema theo cách nào?
- A) Tạo migration TypeORM đầy đủ ✅
- B) Duy trì file SQL thủ công
- C) Đồng thời cả migration + SQL
- D) Dùng `synchronize: true` (dev only)
