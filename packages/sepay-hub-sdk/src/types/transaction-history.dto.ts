import { YmdHmsString } from "./date-types";

export enum TransferType {
  CREDIT = "credit",
  DEBIT = "debit"
}

/**
 * DTO đại diện cho lịch sử giao dịch từ SePay Hub.
 */
export interface TransactionHistoryDto {
  id?: string;
  transaction_id: string;
  transaction_date: YmdHmsString;
  bank_account_id: string;
  account_number: string;
  company_id: string;
  bank_id: string;
  va_id?: string;
  va?: string;
  reference_number: string;
  transaction_content: string;
  payment_code?: string;
  transfer_type: TransferType;
  amount: string;
}
