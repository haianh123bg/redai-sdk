// Raw HTML response type (từ API)
export interface HtmlResponse {
  html: string;
}

// JSON-LD Schema.org types (extracted từ HTML)
export interface JsonLdLocalBusiness {
  "@type"?: string;
  "@id"?: string;
  name?: string;
  url?: string;
  identifier?: {
    "@type"?: string;
    propertyID?: string;
    value?: string;
  };
  address?: {
    "@type"?: string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  foundingDate?: string;
  industry?: string;
  department?: string;
  telephone?: string;
  email?: string;
  founder?: {
    "@type"?: string;
    name?: string;
  };
  numberOfEmployees?: {
    "@type"?: string;
    value?: number | string;
  };
  currenciesAccepted?: string;
  [key: string]: unknown;
}

// Parsed business data (kết quả sau khi parse)
export interface BusinessMessage {
  type: "business";
  tax_no?: string;
  name?: string;
  address?: string;
  address_region?: string;
  address_country?: string;
  issued_date?: string;
  industry?: string;
  department?: string;
  rep_name?: string;
  phone?: string;
  email?: string;
  employees?: number;
  currency?: string;
  website?: string;
  [key: string]: unknown;
}

// Raw metadata extracted từ HTML
export interface RawMetadata {
  canonical_url?: string;
  og_title?: string;
  description?: string;
  json_ld?: unknown[];
}

// Final response type (kết quả trả về cho user)
export interface LookupResponse {
  message: BusinessMessage;
  raw?: RawMetadata;
}
