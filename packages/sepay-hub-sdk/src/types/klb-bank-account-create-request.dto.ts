/**
 * DTO đại diện cho yêu cầu tạo tài khoản liên kết ngân hàng KienLongBank
 */
export interface KlbBankAccountCreateRequestDto {
  /**
   * ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản sắp tạo
   * @example "company-123"
   */
  company_id: string;

  /**
   * Số tài khoản ngân hàng KienLongBank cần liên kết
   * @example "1234567890123456"
   */
  account_number: string;

  /**
   * Tên gợi nhớ
   * @example "Tài khoản chính"
   */
  label?: string;
}
