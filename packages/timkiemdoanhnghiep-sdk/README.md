# @redonvn/timkiemdoanhnghiep-sdk

TypeScript SDK for timkiemdoanhnghiep lookup with HTML parser.

## Features

- ✅ Parse HTML response to structured JSON
- ✅ Extract JSON-LD LocalBusiness schema
- ✅ Type-safe business information
- ✅ Raw metadata access (canonical URL, OG tags, etc.)
- ✅ Standalone HTML parser utilities

## Install

```bash
npm install @redonvn/timkiemdoanhnghiep-sdk
```

## Quick Start

```ts
import { lookupTax } from "@redonvn/timkiemdoanhnghiep-sdk";

const result = await lookupTax("0109165592");
console.log(result.message.name);        // CÔNG TY TNHH TRUYỀN THÔNG VÀ THƯƠNG MẠI REDON
console.log(result.message.tax_no);      // 0109165592
console.log(result.message.address);     // Số 7 ngõ 52 đường Mỹ Đình...
console.log(result.message.rep_name);    // NGUYỄN MẠNH CƯỜNG
console.log(result.message.phone);       // 0334767007
```

## Advanced Usage

### Using Client and Service

```ts
import { TimkiemDoanhnghiepClient, TimkiemDoanhnghiepService } from "@redonvn/timkiemdoanhnghiep-sdk";

const client = new TimkiemDoanhnghiepClient({
  baseUrl: "https://timkiemdoanhnghiep.com",
  timeoutMs: 10000,
  headers: {
    'User-Agent': 'MyApp/1.0'
  }
});

const service = new TimkiemDoanhnghiepService(client);
const result = await service.lookup("0109165592");
```

### Parse Raw HTML

Useful for testing or when you have cached HTML:

```ts
import { parseHtmlToLookupResponse } from "@redonvn/timkiemdoanhnghiep-sdk";

const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <script type="application/ld+json">
      {
        "@type": "LocalBusiness",
        "name": "CÔNG TY ABC",
        "identifier": {"@type": "PropertyValue", "propertyID": "MST", "value": "0123456789"}
      }
      </script>
    </head>
  </html>
`;

const result = parseHtmlToLookupResponse(html);
console.log(result.message.name);  // CÔNG TY ABC
```

### Access Raw Metadata

```ts
const result = await lookupTax("0109165592");

// Access all JSON-LD schemas found in HTML
console.log(result.raw?.json_ld);

// Access canonical URL
console.log(result.raw?.canonical_url);

// Access Open Graph title
console.log(result.raw?.og_title);

// Access meta description
console.log(result.raw?.description);
```

## Response Types

### LookupResponse

```ts
interface LookupResponse {
  message: BusinessMessage;
  raw?: RawMetadata;
}
```

### BusinessMessage

```ts
interface BusinessMessage {
  type: "business";
  tax_no?: string;           // Mã số thuế
  name?: string;             // Tên doanh nghiệp
  address?: string;          // Địa chỉ
  address_region?: string;   // Tỉnh/thành phố
  address_country?: string;  // Quốc gia
  issued_date?: string;      // Ngày cấp
  industry?: string;         // Ngành nghề
  department?: string;       // Phòng ban
  rep_name?: string;         // Người đại diện
  phone?: string;            // Điện thoại
  email?: string;            // Email
  employees?: number;        // Số lượng nhân viên
  currency?: string;         // Loại tiền tệ
  website?: string;          // Website
}
```

### RawMetadata

```ts
interface RawMetadata {
  canonical_url?: string;    // Canonical URL từ HTML
  og_title?: string;         // Open Graph title
  description?: string;      // Meta description
  json_ld?: unknown[];       // Tất cả JSON-LD schemas tìm thấy
}
```

## Parser Utilities

The SDK provides standalone HTML parser utilities that you can use independently:

```ts
import {
  extractJsonLd,
  findLocalBusiness,
  extractCanonicalUrl,
  extractMeta,
  convertToBusinessMessage
} from "@redonvn/timkiemdoanhnghiep-sdk/utils/html-parser";

// Extract all JSON-LD schemas from HTML
const schemas = extractJsonLd(html);

// Find LocalBusiness schema
const business = findLocalBusiness(schemas);

// Convert to BusinessMessage
const message = convertToBusinessMessage(business);

// Extract metadata
const canonicalUrl = extractCanonicalUrl(html);
const ogTitle = extractMeta(html, "property", "og:title");
```

## How It Works

1. **Fetch HTML**: SDK calls `https://timkiemdoanhnghiep.com/search/?q={taxNo}`
2. **Parse HTML**: Extracts JSON-LD schema (LocalBusiness type) from HTML
3. **Convert to JSON**: Maps JSON-LD fields to structured BusinessMessage
4. **Return Response**: Returns typed LookupResponse with business data and raw metadata

## Error Handling

```ts
import { TimkiemDoanhnghiepError } from "@redonvn/timkiemdoanhnghiep-sdk";

try {
  const result = await lookupTax("0109165592");
} catch (error) {
  if (error instanceof TimkiemDoanhnghiepError) {
    console.error('Error:', error.message);
    console.error('Status:', error.status);
    console.error('Body:', error.body);
  }
}
```

## License

MIT
