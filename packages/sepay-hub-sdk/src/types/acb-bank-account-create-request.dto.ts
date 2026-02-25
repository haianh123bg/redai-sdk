/**
 * DTO đại diện cho yêu cầu tạo tài khoản liên kết ngân hàng ACB
 */
export interface AcbBankAccountCreateRequestDto {
  /**
   * ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản sắp tạo
   * @example "company-123"
   */
  company_id: string;

  /**
   * Tên chủ tài khoản ngân hàng ACB dành cho cá nhân
   * @example "NGUYEN VAN A"
   */
  account_holder_name: string;

  /**
   * Số tài khoản ngân hàng ACB cần liên kết
   * @example "1234567890123456"
   */
  account_number: string;

  /**
   * Số điện thoại đã dùng để đăng ký tài khoản ngân hàng ACB
   * @example "0912345678"
   */
  phone_number: string;

  /**
   * Tên gợi nhớ
   * @example "Tài khoản ACB chính"
   */
  label?: string;
}
