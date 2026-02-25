import { YmdString } from "./date-types";

/**
 * DTO đại diện cho bộ đếm giao dịch từ SePay Hub.
 */
export interface TransactionCounterDto {
  company_id: string;
  date: YmdString;
  transaction: string;
  transaction_in: string;
  transaction_out: string;
}
