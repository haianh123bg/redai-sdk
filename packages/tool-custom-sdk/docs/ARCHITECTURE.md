# Tong quan kien truc (Stateless)

## Muc dich
`tool-custom-sdk` la thu vien stateless de:
1. Import OpenAPI/Postman thanh IR.
2. Generate tool definition cho OpenAI/Google.
3. Execute HTTP runtime dua tren `RequestDefinition` + context/auth/policy.

SDK khong con persistence, khong con Nest module/service, va khong quan ly DB.

## Luong chinh
1. `OpenApiImporter`/`PostmanImporter` -> IR (`ApiOperation`, `RequestDefinition`, `Schema`).
2. `buildToolDefinitions(...)` -> schema tool cho target model.
3. `executeFromOperation(...)` (su dung `AxiosExecutor`) -> outbound HTTP call voi guardrails.

## So do cap cao
```txt
OpenAPI/Postman
      |
      v
  Importers  --->  IR (ApiOperation, RequestDefinition, Schema)
                         |
              +----------+-----------+
              |                      |
              v                      v
        Generators             Executor (Axios)
      (OpenAI/Google)      (auth + policy + masking)
```

## Thanh phan chinh
- Importers:
  - `importers/openapi-importer.ts`
  - `importers/postman-importer.ts`
- Generators:
  - `generators/openai-tool-generator.ts`
  - `generators/google-tool-generator.ts`
- Executor:
  - `executor/axios-executor.ts`
- Facade stateless:
  - `normalizeImportedOperations(...)`
  - `buildToolDefinitions(...)`
  - `executeFromOperation(...)`

## Mo hinh du lieu (IR)
- `ApiOperation`: mo ta operation de sinh tool + execute.
- `RequestDefinition`: url/method/params/headers/body/auth.
- `Schema`: schema noi bo de map sang JSON schema tool platform.
- `ExecutionContext` + `ExecutionPolicy`: thong tin runtime mode va guardrails.

## Auth runtime hien co
- none, bearer, basic, apiKey
- oauth2, openIdConnect, oauth1
- awsSigV4, hawk, digest, ntlm, custom

## Ghi chu clean break
- Da xoa hoan toan lop persistence/Nest integration legacy.
- SDK hien tai chi con stateless import/generate/execute path.
