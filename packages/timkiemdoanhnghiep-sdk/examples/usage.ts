/**
 * Example: How to use timkiemdoanhnghiep-sdk with HTML parser
 */

import { 
  lookupTax, 
  parseHtmlToLookupResponse,
  TimkiemDoanhnghiepClient,
  TimkiemDoanhnghiepService
} from '../src';

// Example 1: Simple lookup using helper function
async function example1() {
  const result = await lookupTax('0109165592');
  
  console.log('Business Info:', result.message);
  console.log('Tax No:', result.message.tax_no);
  console.log('Name:', result.message.name);
  console.log('Address:', result.message.address);
  console.log('Representative:', result.message.rep_name);
  
  console.log('\nRaw Metadata:', result.raw);
}

// Example 2: Using client and service directly
async function example2() {
  const client = new TimkiemDoanhnghiepClient({
    baseUrl: 'https://timkiemdoanhnghiep.com',
    headers: {
      'User-Agent': 'MyApp/1.0'
    }
  });

  const service = new TimkiemDoanhnghiepService(client);
  const result = await service.lookup('0109165592');
  
  console.log('Result:', result);
}

// Example 3: Parse raw HTML directly (useful for testing or caching)
async function example3() {
  // Giả sử bạn đã có HTML từ cache hoặc từ nguồn khác
  const rawHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script type="application/ld+json">
        {
          "@type": "LocalBusiness",
          "name": "CÔNG TY TNHH TRUYỀN THÔNG VÀ THƯƠNG MẠI REDON",
          "identifier": {"@type": "PropertyValue", "propertyID": "MST", "value": "0109165592"},
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Số 7 ngõ 52 đường Mỹ Đình",
            "addressRegion": "Thành phố Hà Nội"
          },
          "telephone": "0334767007"
        }
        </script>
      </head>
    </html>
  `;

  // Parse HTML trực tiếp thành JSON
  const result = parseHtmlToLookupResponse(rawHtml);
  
  console.log('Parsed from HTML:', result);
}

// Example 4: Access raw JSON-LD data
async function example4() {
  const result = await lookupTax('0109165592');
  
  // Truy cập raw JSON-LD schemas
  if (result.raw?.json_ld) {
    console.log('All JSON-LD schemas found:', result.raw.json_ld);
  }
  
  // Truy cập canonical URL
  console.log('Canonical URL:', result.raw?.canonical_url);
  
  // Truy cập Open Graph title
  console.log('OG Title:', result.raw?.og_title);
}

// Run examples
async function main() {
  try {
    console.log('=== Example 1: Simple lookup ===');
    await example1();
    
    console.log('\n=== Example 2: Using client directly ===');
    await example2();
    
    console.log('\n=== Example 3: Parse raw HTML ===');
    await example3();
    
    console.log('\n=== Example 4: Access raw data ===');
    await example4();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run:
// main();
