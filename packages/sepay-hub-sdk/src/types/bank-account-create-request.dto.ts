/**
 * DTO đại diện cho yêu cầu tạo tài khoản ngân hàng mới
 */
export interface BankAccountCreateRequestDto {
  /**
   * ID công ty (tổ chức) sở hữu tài khoản ngân hàng
   */
  company_id: string;

  /**
   * Tên chủ tài khoản
   */
  account_holder_name: string;

  /**
   * Số tài khoản
   */
  account_number: string;

  /**
   * Tên gợi nhớ
   */
  label: string;

  /**
   * Số điện thoại liên kết với tài khoản ngân hàng
   */
  phone_number: string;

  /**
   * Căn cước công dân
   */
  identification_number: string;
}
