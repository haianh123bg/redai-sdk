# Notes / Lessons learned

- Khi chỉnh sửa file có tiếng Việt, luôn đọc/ghi với UTF-8 (không dùng mặc định của PowerShell). Nếu cần, dùng `Set-Content -Encoding utf8` hoặc `Out-File -Encoding utf8` để tránh mất dấu.
- Hạn chế thao tác thay thế bằng PowerShell trên file có tiếng Việt nếu không kiểm soát encoding; ưu tiên `apply_patch` hoặc editor ghi UTF-8.