/**
 * DTO đại diện cho thông tin tài khoản ảo (VA) từ SePay Hub
 */
export interface VirtualAccountDto {
  /**
   * ID tài khoản ngân hàng
   */
  id: string;

  /**
   * ID công ty (tổ chức) sở hữu tài khoản ngân hàng
   */
  company_id: string;

  /**
   * ID tài khoản ngân hàng sở hữu VA
   */
  bank_account_id: string;

  /**
   * Số VA
   */
  va: string;

  /**
   * Tên gợi nhớ
   */
  label: string;

  /**
   * Trạng thái hoạt động
   */
  active: '1' | '0';

  /**
   * Ngày tạo (định dạng Y-m-d H:i:s)
   */
  created_at: string;

  /**
   * Lần cập nhật cuối (định dạng Y-m-d H:i:s)
   */
  updated_at: string;
}
