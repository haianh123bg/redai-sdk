# @redonvn/p03-erp-v1-frontend-sdk

SDK frontend cơ bản cho Project03 ERP v1.

## Cài đặt

```bash
npm install @redonvn/p03-erp-v1-frontend-sdk
```

## Sử dụng

```ts
import { FrontendSdkClient } from "@redonvn/p03-erp-v1-frontend-sdk";

const client = new FrontendSdkClient({
  apiBaseUrl: "https://localhost:8443",
  accessToken: "your-token"
});

const headers = client.buildHeaders({ "x-request-id": "req-123" });
```
