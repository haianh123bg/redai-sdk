# Breaking Changes (v0.x)

Tài liệu này mô tả các thay đổi phá vỡ tương thích khi chuẩn hóa SDK theo docs v1.0.4.

## 1) API surface chuyển sang domain-based

Trước đây gọi trực tiếp nhiều method phẳng trên service.  
Hiện tại ưu tiên:

- `service.company.*`
- `service.acb.*`
- `service.mb.*`
- `service.ocb.*`
- `service.klb.*`
- `service.bankAccount.*`
- `service.transaction.*`

## 2) Return type được chuẩn hóa

Các method không còn trả shape “nửa envelope nửa data”.

- `SepayOperationResult` cho thao tác create/update/confirm/request/delete
- `SepayDetailResult<T>` cho endpoint chi tiết
- `SepayPaginatedResult<T>` cho endpoint danh sách

## 3) Type tightening

- `CompanyCreateRequestDto.status` và `CompanyUpdateRequestDto.status`:
  - Từ kiểu string tự do -> `CompanyStatus`
- Query object tự do:
  - Thay bằng DTO cụ thể: `CompanyListQueryDto`, `BankAccountListQueryDto`, `TransactionListQueryDto`, `VaListQueryDto`
- Trường ngày giờ:
  - Chuẩn hóa về `YmdString`/`YmdHmsString`

## 4) Error handling thay đổi

Trước đây chủ yếu map lỗi theo HTTP transport.  
Hiện tại:

- Map lỗi theo `operationKey x response.code`
- Tách `transport error` và `business error`
- Trả metadata `retryable` trong `SepayHubError`

## 5) Header/validation chặt hơn

- Các endpoint confirm yêu cầu `requestId` không rỗng
- `Client-Message-Id` được gắn tự động trên request
- Trường hợp response thiếu cấu trúc bắt buộc -> ném `UNEXPECTED_RESPONSE`

## 6) Cách migrate nhanh

1. Đổi call site sang domain method (`service.mb.lookupAccountHolder` thay cho helper cũ).
2. Cập nhật xử lý return type theo `item/items/meta`.
3. Bọc toàn bộ call trong `try/catch` và xử lý `SepayHubError` (`code`, `status`, `retryable`).
4. Sửa payload/query theo DTO mới và enum/union mới.

