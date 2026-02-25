import { YmdHmsString } from "./date-types";

export type SepayIpnTransferType = "in" | "out";

/**
 * Payload IPN SePay gửi về hệ thống merchant khi phát sinh biến động số dư.
 */
export interface SepayIpnPayloadDto {
  gateway: string;
  transaction_date: YmdHmsString;
  account_number: string;
  code: string | null;
  content: string;
  transfer_type: SepayIpnTransferType;
  transfer_amount: number;
  accumulated: number;
  sub_acc_id: string | null;
  reference_code: string;
  description: string;
}

/**
 * Thông tin dùng để merchant tự xác thực/tự đối soát IPN.
 * Docs hiện chưa định nghĩa signature bắt buộc, nên helper này dạng mở rộng.
 */
export interface SepayIpnVerification {
  requestId?: string;
  receivedAtEpochMs: number;
  sourceIp?: string;
}
