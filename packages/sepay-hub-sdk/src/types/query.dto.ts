export interface VaListQueryDto {
  per_page?: string;
  q?: string;
  company_id?: string;
  bank_account_id?: string;
}

export interface CompanyListQueryDto {
  per_page?: string;
  q?: string;
  status?: "Pending" | "Active" | "Suspended" | "Terminated" | "Cancelled" | "Fraud";
  "sort[created_at]"?: "asc" | "desc";
}

export interface BankAccountListQueryDto {
  per_page?: string;
  q?: string;
  company_id?: string;
  bank_id?: string;
}

export interface TransactionListQueryDto extends BankAccountListQueryDto {
  transaction_date?: string;
  start_transaction_date?: string;
  end_transaction_date?: string;
  transfer_type?: "credit" | "debit";
  va_id?: string;
}
