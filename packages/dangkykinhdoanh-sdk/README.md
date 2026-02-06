# @redonvn/dangkykinhdoanh-sdk

TypeScript SDK for [dangkykinhdoanh.gov.vn](https://dangkykinhdoanh.gov.vn) enterprise search API.

## Features

- ✅ **Type-safe**: Full TypeScript support with comprehensive types
- ✅ **Clean API**: Convert raw `RELOAD[...]` response to structured JSON
- ✅ **Auto-parsing**: Extract MSNB (registration number) and MSDN (tax number) from HTML
- ✅ **Dual format**: ESM and CommonJS builds
- ✅ **Zero dependencies**: Only requires `axios`

## Installation

```bash
npm install @redonvn/dangkykinhdoanh-sdk
# or
yarn add @redonvn/dangkykinhdoanh-sdk
```

## Quick Start

```typescript
import { searchEnterprises } from "@redonvn/dangkykinhdoanh-sdk";

// Simple search
const result = await searchEnterprises("CÔNG TY CP");

console.log(`Found ${result.total} enterprises`);
result.enterprises.forEach(enterprise => {
  console.log(enterprise.name);
  console.log(`MSNB: ${enterprise.registration_no}`);
  console.log(`MSDN: ${enterprise.tax_no}`);
});
```

## API Reference

### `searchEnterprises(searchField, lang?)`

Helper function to search enterprises by name.

**Parameters:**
- `searchField` (string): Search query (e.g., "CÔNG TY", "VIN", "FPT")
- `lang` (string, optional): Language code, default: "vn"

**Returns:** `Promise<SearchResponse>`

```typescript
interface SearchResponse {
  total: number;              // Number of results found
  enterprises: EnterpriseItem[];
  raw: string;               // Original response for debugging
}

interface EnterpriseItem {
  id: string;                // Enterprise ID
  name: string;              // Clean name (extracted from HTML)
  raw_name: string;          // Original HTML response
  registration_no?: string;  // MSNB (Mã số bản ghi)
  tax_no?: string;           // MSDN (Mã số doanh nghiệp)
}
```

### Using Service Instance

```typescript
import { DangKyKinhDoanhService } from "@redonvn/dangkykinhdoanh-sdk";

const service = new DangKyKinhDoanhService();

// Search with custom language
const result = await service.search("VIN", "en");

// Get raw response for debugging
const rawText = await service.searchRaw("CÔNG TY");
console.log(rawText); // "RELOAD[{Id:'...', Name:'<div>...</div>'}]"
```

### Using Client Directly

```typescript
import { DangKyKinhDoanhClient } from "@redonvn/dangkykinhdoanh-sdk";

const client = new DangKyKinhDoanhClient();

// Make raw POST request
const response = await client.request("/path", {
  searchField: "query",
  h: "hash",
  lang: "vn"
});

// Get text response
const text = await client.getText("/path", { searchField: "query" });
```

### Parser Utilities

```typescript
import { 
  parseSearchResponse, 
  isValidReloadResponse,
  extractRawArray 
} from "@redonvn/dangkykinhdoanh-sdk";

// Parse raw RELOAD response
const rawText = "RELOAD[{Id:'123', Name:'<div>...</div>'}]";
const parsed = parseSearchResponse(rawText);

// Validate format
const isValid = isValidReloadResponse(rawText); // true

// Extract array without parsing
const arrayStr = extractRawArray(rawText); // "[{Id:'123',...}]"
```

## Response Format

The API returns data in `RELOAD[...]` format with HTML-embedded information:

**Raw Response:**
```
RELOAD[{Id:'6857535', Name:'<div style="color:Red"><b>CÔNG TY CP...</b><br/>MSNB: 0022018388; MSDN: 0109165592</div>'}]
```

**Parsed Response:**
```typescript
{
  total: 1,
  enterprises: [
    {
      id: '6857535',
      name: 'CÔNG TY CP...',
      raw_name: '<div style="color:Red"><b>CÔNG TY CP...</b><br/>MSNB: 0022018388; MSDN: 0109165592</div>',
      registration_no: '0022018388',
      tax_no: '0109165592'
    }
  ],
  raw: 'RELOAD[...]'
}
```

## Examples

### Search with Error Handling

```typescript
import { searchEnterprises } from "@redonvn/dangkykinhdoanh-sdk";

try {
  const result = await searchEnterprises("FPT");
  
  if (result.total === 0) {
    console.log("No enterprises found");
  } else {
    result.enterprises.forEach(ent => {
      console.log(`${ent.name} - ${ent.tax_no}`);
    });
  }
} catch (error) {
  console.error("Search failed:", error);
}
```

### Filter Results

```typescript
const result = await searchEnterprises("CÔNG TY");

// Only enterprises with tax number
const withTaxNo = result.enterprises.filter(e => e.tax_no);

// Only enterprises with both MSNB and MSDN
const complete = result.enterprises.filter(e => 
  e.registration_no && e.tax_no
);
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run typecheck

# Development mode with watch
npm run dev
```

## License

MIT

## Related SDKs

- [@redonvn/mst-sdk](../mst-sdk) - MST lookup
- [@redonvn/neac-verify-sdk](../neac-verify-sdk) - NEAC verification
- [@redonvn/timkiemdoanhnghiep-sdk](../timkiemdoanhnghiep-sdk) - Business lookup
