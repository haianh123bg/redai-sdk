export interface EnterpriseMessage {
  type: "enterprise";
  tax_no: string;
  addr?: string;
  international_name?: string;
  short_name?: string;
  phone?: string;
  rep_name?: string;
  issued_date?: string;
  tax_dep?: string;
  status?: string;
  org_type?: string;
  industry?: string;
  [key: string]: unknown;
}

export interface IndividualMessage {
  type: "individual";
  tax_no: string;
  addr?: string;
  name?: string;
  issued_date?: string;
  tax_dep?: string;
  status?: string;
  [key: string]: unknown;
}

export type LookupMessage = EnterpriseMessage | IndividualMessage;

export interface LookupResponse {
  message: LookupMessage;
}
