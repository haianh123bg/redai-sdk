# @redonvn/p03-erp-v1-workflow-engine-sdk

SDK domain cho workflow engine trong Project03 ERP v1.

## Cài đặt

```bash
npm install @redonvn/p03-erp-v1-workflow-engine-sdk
```

## Sử dụng

```ts
import { createWorkflowRunInput } from "@redonvn/p03-erp-v1-workflow-engine-sdk";

const input = createWorkflowRunInput("invoice.approve", { invoiceId: "inv-001" }, "user-123");
```
