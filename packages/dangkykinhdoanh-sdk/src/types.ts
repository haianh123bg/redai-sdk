export interface EnterpriseItem {
  id: string;
  name: string;
  raw_name: string;
  registration_no?: string;
  tax_no?: string;
  [key: string]: unknown;
}

export interface SearchResponse {
  total: number;
  enterprises: EnterpriseItem[];
  raw: string;
}
