# @redonvn/sepay-hub-sdk

SDK TypeScript cho SePay Bank Hub API (chuẩn theo tài liệu `SePay Bank Hub API Documentation v1.0.4`).

## Cài đặt

```bash
npm install @redonvn/sepay-hub-sdk
```

## Khởi tạo

```ts
import { SepayHubService } from "@redonvn/sepay-hub-sdk";

const sepay = new SepayHubService({
  clientId: process.env.SEPAY_CLIENT_ID!,
  clientSecret: process.env.SEPAY_CLIENT_SECRET!,
  timeoutMs: 20000
});
```

## API Surface (domain-based)

- `service.company.*`
- `service.bankAccount.*`
- `service.transaction.*`
- `service.acb.*`
- `service.mb.*`
- `service.ocb.*`
- `service.klb.*`

Ví dụ:

```ts
const companyResult = await sepay.company.create({
  full_name: "Công ty ABC",
  short_name: "ABC",
  status: "active"
});

const companies = await sepay.company.list({ page: 1, limit: 20 });
const mbLookup = await sepay.mb.lookupAccountHolder({
  account_number: "0123456789"
});

console.log(companyResult.code, companies.meta.total, mbLookup.item);
```

## Chuẩn return type

- `SepayOperationResult`:
  - Dùng cho thao tác nghiệp vụ create/update/confirm/request/delete.
  - Trả về `code`, `message`, optional `id`, optional `request_id`.
- `SepayDetailResult<T>`:
  - Trả một bản ghi tại `item`.
- `SepayPaginatedResult<T>`:
  - Trả `items` + `meta` phân trang.

## Chuẩn lỗi

SDK ném `SepayHubError` theo 2 lớp:

- `Transport error`:
  - timeout/network/http transport.
- `Business error`:
  - HTTP thành công nhưng `response.code` không nằm trong success set theo từng endpoint.

Thông tin lỗi:

- `code`: `CONFIGURATION_ERROR | AUTHENTICATION_ERROR | VALIDATION_ERROR | API_ERROR | NETWORK_ERROR | TIMEOUT_ERROR | UNEXPECTED_RESPONSE`
- `status`: HTTP status (nếu có)
- `operation`: mô tả nghiệp vụ đang gọi
- `requestId`: giá trị `Request-Id` nếu có
- `details`: payload lỗi gốc từ SePay
- `retryable`: gợi ý có nên retry hay không

```ts
import { SepayHubError } from "@redonvn/sepay-hub-sdk";

try {
  await sepay.acb.createAccount({
    account_holder_name: "Nguyen Van A",
    account_number: "1234567890",
    phone_number: "0900000000"
  });
} catch (error) {
  if (error instanceof SepayHubError) {
    console.error({
      code: error.code,
      status: error.status,
      operation: error.operation,
      retryable: error.retryable,
      requestId: error.requestId,
      details: error.details
    });
  }
}
```

## Type exports chính

- `SepayHubService`, `SepayHubClient`
- `SepayHubError`, `SepayHubErrorCode`
- `SepayOperationKey`, `isSuccessCode`, `getBusinessErrorPolicy`
- `SepayOperationResult`, `SepayDetailResult<T>`, `SepayPaginatedResult<T>`
- DTOs trong `src/types/*` bao gồm query DTO và IPN DTO:
  - `CompanyListQueryDto`, `BankAccountListQueryDto`, `TransactionListQueryDto`, `VaListQueryDto`
  - `SepayIpnPayloadDto`, `SepayIpnTransferType`, `SepayIpnVerification`

## Tài liệu bổ sung

- Mapping docs -> SDK: `docs/SDK_MAPPING.md`
- Breaking changes: `docs/BREAKING_CHANGES.md`

