# @redonvn/infodoanhnghiep-sdk

TypeScript SDK for InfoDoanhNghiep company lookup.

## Install

```bash
npm install @redonvn/infodoanhnghiep-sdk
```

## Usage

### Using InfoDoanhNghiepClient and InfoDoanhNghiepService

```ts
import { InfoDoanhNghiepClient, InfoDoanhNghiepService } from "@redonvn/infodoanhnghiep-sdk";

const client = new InfoDoanhNghiepClient();
const service = new InfoDoanhNghiepService(client);

const result = await service.lookup("0109165592");
console.log("Found companies:", result.totalResults);

for (const company of result.companies) {
  console.log("Name:", company.name);
  console.log("Tax Code:", company.taxCode);
  console.log("Legal Rep:", company.legalRepresentative);
  console.log("Address:", company.address);
  console.log("City:", company.city);
  console.log("Established:", company.establishedDate);
  console.log("Detail URL:", company.detailUrl);
}
```

### One-off helper

```ts
import { lookupCompany } from "@redonvn/infodoanhnghiep-sdk";

const result = await lookupCompany("0109165592");
console.log(result.companies[0].name);
// Output: CÔNG TY TNHH TRUYỀN THÔNG VÀ THƯƠNG MẠI REDON
```

## Configuration

```ts
const client = new InfoDoanhNghiepClient({
  baseUrl: "https://infodoanhnghiep.com", // Default
  timeoutMs: 10000
});
```

## Response Type

```ts
interface LookupResponse {
  companies: CompanyInfo[];
  totalResults: number;
}

interface CompanyInfo {
  name: string;                  // Tên công ty
  taxCode: string;               // Mã số thuế
  legalRepresentative: string;   // Đại diện pháp luật
  address: string;               // Địa chỉ
  city: string;                  // Tỉnh/Thành phố
  establishedDate: string;       // Ngày thành lập
  detailUrl: string;             // Link chi tiết
}
```

## API Endpoint

- **Method**: GET
- **URL**: `https://infodoanhnghiep.com/tim-kiem/auto/{maSoThue}/`
- **Description**: Search company information by tax code
