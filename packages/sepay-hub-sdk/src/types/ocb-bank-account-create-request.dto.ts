/**
 * DTO đại diện cho yêu cầu tạo tài khoản liên kết ngân hàng OCB
 */
export interface OcbBankAccountCreateRequestDto {
  /**
   * ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản sắp tạo
   * @example "company-123"
   */
  company_id: string;

  /**
   * Tên chủ tài khoản ngân hàng OCB dành cho cá nhân
   * Giá trị này lấy từ API Truy vấn tên chủ tài khoản ngân hàng OCB
   * @example "NGUYEN VAN A"
   */
  account_holder_name: string;

  /**
   * Số tài khoản ngân hàng OCB cần liên kết
   * @example "1234567890123456"
   */
  account_number: string;

  /**
   * Số CMND/CCCD đã dùng để đăng ký tài khoản ngân hàng OCB
   * @example "001202012345"
   */
  identification_number: string;

  /**
   * Số điện thoại đã dùng để đăng ký tài khoản ngân hàng OCB
   * @example "0912345678"
   */
  phone_number: string;

  /**
   * Tên gợi nhớ
   * @example "Tài khoản OCB chính"
   */
  label?: string;
}
