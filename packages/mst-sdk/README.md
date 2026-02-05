# @redonvn/mst-sdk

TypeScript SDK for MST lookup.

## Install

```bash
npm install @redonvn/mst-sdk
```

## Usage

```ts
import { MstClient } from "@redonvn/mst-sdk";

const client = new MstClient();
const result = await client.lookup("0109165592");
console.log(result.message);
```

## One-off helper

```ts
import { lookupTax } from "@redonvn/mst-sdk";

const result = await lookupTax("0109165592");
console.log(result.message.short_name);
```

## Configuration

```ts
const client = new MstClient({
  baseUrl: "https://mst.8686.vn",
  timeoutMs: 10000
});
```
