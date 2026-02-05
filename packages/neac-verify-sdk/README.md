# @redonvn/neac-verify-sdk

TypeScript SDK for NEAC signature verification (Node.js).

## Install

```bash
npm install @redonvn/neac-verify-sdk
```

## Usage (Buffer)

```ts
import { verifyFile } from "@redonvn/neac-verify-sdk";
import { readFile } from "node:fs/promises";

const buffer = await readFile("./sample.pdf");
const result = await verifyFile({
  buffer,
  filename: "sample.pdf",
  mimeType: "application/pdf"
});

console.log(result.signature.status);
```

## Usage (URL)

```ts
import { verifyFile } from "@redonvn/neac-verify-sdk";

const result = await verifyFile({
  url: "https://example.com/sample.pdf"
});

console.log(result.signature.message);
```

## Custom Options

```ts
import { NeacVerifyService } from "@redonvn/neac-verify-sdk";

const service = new NeacVerifyService({
  verifyUrl: "https://neac.gov.vn/vi/Home/VerifyFileByNeac",
  timeoutMs: 20000
});

const result = await service.verifyFile({
  url: "https://example.com/sample.pdf"
});
```
