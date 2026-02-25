# SDK Publish Commands (Windows PowerShell)

## 1) Bump version

```powershell
# Patch (0.1.20 -> 0.1.21)
npm version patch --no-git-tag-version

# Minor
npm version minor --no-git-tag-version

# Major
npm version major --no-git-tag-version
```

## 2) Build + verify local artifact

```powershell
# Build clean dist
npm run build

# Kiểm tra runtime enum quan trọng trong dist
Select-String -Path dist/generated/dynamic-table/types.js -Pattern "ImportFileFormat|JobStatus"

# Tạo file tarball để kiểm tra package publish
npm pack --json
```

## 3) Kiểm tra package.json bên trong tarball

```powershell
# Đổi đúng version file .tgz nếu cần
tar -xOf redonvn-redai-backend-api-sdk-0.1.20.tgz package/package.json
```

## 4) Smoke test import từ package packed

```powershell
# Tạo workspace test tạm
if (Test-Path .tmp-smoke) { cmd /c "rmdir /s /q .tmp-smoke" }
mkdir .tmp-smoke | Out-Null

@'
{
  "name": "tmp-smoke",
  "private": true,
  "type": "module"
}
'@ | Set-Content -Path .tmp-smoke/package.json

# Cài package từ tgz
npm i --prefix .tmp-smoke --no-audit --no-fund ./redonvn-redai-backend-api-sdk-0.1.20.tgz

# Root import check
node -e "const m=require('@redonvn/redai-backend-api-sdk'); console.log('root', 'ImportFileFormat' in m, 'JobStatus' in m);"

# Subpath import check
node -e "const m=require('@redonvn/redai-backend-api-sdk/generated'); console.log('generated', 'ImportFileFormat' in m, 'JobStatus' in m);"
```

## 5) Publish npm

```powershell
# prepublishOnly sẽ tự chạy npm run build
npm publish --access public
```

## 6) Cleanup file tạm sau verify

```powershell
if (Test-Path .tmp-smoke) { cmd /c "rmdir /s /q .tmp-smoke" }
if (Test-Path redonvn-redai-backend-api-sdk-0.1.20.tgz) { del redonvn-redai-backend-api-sdk-0.1.20.tgz }
```

## 7) Lệnh phía app consumer sau khi publish

```powershell
# Update SDK
npm i @redonvn/redai-backend-api-sdk@0.1.20

# Xóa cache prebundle của Vite
Remove-Item -Recurse -Force node_modules/.vite

# Chạy lại dev và ép optimize deps
npm run dev -- --force
```

## Quick checklist trước publish

1. `npm version ... --no-git-tag-version`
2. `npm run build`
3. `npm pack --json`
4. Smoke test import từ `.tgz`
5. `npm publish --access public`
