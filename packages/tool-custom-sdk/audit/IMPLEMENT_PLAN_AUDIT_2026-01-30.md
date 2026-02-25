# Nhật ký kiểm toán - Kế hoạch triển khai SDK

Nguồn kế hoạch: kế hoạch triển khai theo ưu tiên A -> B -> C -> D
Ngày thực hiện: 2026-01-30
Người thực hiện: Codex

## Các bước và trạng thái
1) Chuẩn hóa UTF-8 cho chuỗi tiếng Việt trong src/. - xong (src đã ở UTF-8, không cần sửa nội dung)
2) Triển khai đầy đủ auth runtime trong AxiosExecutor cho tất cả loại trong auth.ts. - xong
3) Mở rộng OpenAPI importer (responses theo status code + default, cookie params). - xong
4) Thêm repository PostgreSQL (schema + implementation). - xong
5) Cập nhật generator docs sang docs/generated và cập nhật sitemap. - xong

## Thay đổi chính
- Thêm response definition vào IR và map response từ OpenAPI.
- Thêm cookie params từ OpenAPI vào request definition.
- Bổ sung thực thi auth: oauth2, openIdConnect, oauth1, awsSigV4, hawk, digest, ntlm (ntlm cần authorization có sẵn).
- Thêm Postgres repository và schema SQL.
- Generator docs xuất ra docs/generated và cập nhật sitemap tổng.
- Chuẩn hóa docs/README, docs/SUMMARY, docs/ARCHITECTURE, docs/PLAN, audit log sang UTF-8.

## Tạo ra / cập nhật
- src/executor/axios-executor.ts
- src/importers/openapi-importer.ts
- src/repository/postgres-api-repository.ts
- src/types/auth.ts
- src/types/ir.ts
- src/index.ts
- schema/postgres.sql
- tools/generate-docs.js
- docs/ARCHITECTURE.md
- docs/README.md
- docs/SUMMARY.md
- docs/PLAN.md
- docs/sitemap.json
- docs/sitemap.xml
- docs/generated/*
- package.json

## Ghi chú
- Cần chạy npm install để cập nhật package-lock.json cho dependency pg.