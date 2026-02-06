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

export interface LookupResponse {
  message: BusinessMessage;
  raw?: {
    canonical_url?: string;
    og_title?: string;
    description?: string;
    json_ld?: unknown[];
  };
}
