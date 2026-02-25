/**
 * DTO đại diện cho thông tin tài khoản ngân hàng từ SePay Hub
 */
export interface BankAccountDto {
  /**
   * ID tài khoản ngân hàng
   */
  id: string;

  /**
   * ID công ty (tổ chức) sở hữu tài khoản ngân hàng
   */
  company_id: string;

  /**
   * ID ngân hàng
   */
  bank_id: string;

  /**
   * Tên chủ tài khoản
   */
  account_holder_name: string;

  /**
   * Số tài khoản
   */
  account_number: string;

  /**
   * Số dư
   */
  accumulated: string;

  /**
   * Tên gợi nhớ
   */
  label: string;

  /**
   * Trạng thái đã liên kết API ngân hàng hay chưa
   */
  bank_api_connected: '1' | '0';

  /**
   * Thời gian phát sinh giao dịch lần cuối (định dạng Y-m-d H:i:s)
   */
  last_transaction: string;

  /**
   * Ngày tạo (định dạng Y-m-d H:i:s)
   */
  created_at: string;

  /**
   * Lần cập nhật cuối (định dạng Y-m-d H:i:s)
   */
  updated_at: string;
}
