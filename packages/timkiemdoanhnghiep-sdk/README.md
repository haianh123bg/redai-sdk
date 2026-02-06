# @redonvn/timkiemdoanhnghiep-sdk

TypeScript SDK for timkiemdoanhnghiep lookup (HTML parse).

## Install

```bash
npm install @redonvn/timkiemdoanhnghiep-sdk
```

## Usage

```ts
import { TimkiemDoanhnghiepClient, TimkiemDoanhnghiepService } from "@redonvn/timkiemdoanhnghiep-sdk";

const client = new TimkiemDoanhnghiepClient();
const service = new TimkiemDoanhnghiepService(client);
const result = await service.lookup("0109165592");
console.log(result.message.name);
```

## One-off helper

```ts
import { lookupTax } from "@redonvn/timkiemdoanhnghiep-sdk";

const result = await lookupTax("0109165592");
console.log(result.message.address);
```

## Configuration

```ts
const client = new TimkiemDoanhnghiepClient({
  baseUrl: "https://timkiemdoanhnghiep.com",
  timeoutMs: 10000
});
```
