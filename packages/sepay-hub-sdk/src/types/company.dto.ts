import { YmdHmsString } from "./date-types";

export enum CompanyStatus {
  PENDING = "Pending",
  ACTIVE = "Active",
  SUSPENDED = "Suspended",
  TERMINATED = "Terminated",
  CANCELLED = "Cancelled",
  FRAUD = "Fraud"
}

/**
 * DTO đại diện cho thông tin công ty (tổ chức) từ SePay Hub.
 */
export interface CompanyDto {
  id: string;
  full_name: string;
  short_name: string;
  status: CompanyStatus;
  created_at: YmdHmsString;
  updated_at: YmdHmsString;
}
