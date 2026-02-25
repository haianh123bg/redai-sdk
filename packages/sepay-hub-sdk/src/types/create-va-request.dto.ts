/**
 * DTO đại diện cho yêu cầu tạo tài khoản ảo (VA)
 */
export interface CreateVARequestDto {
  /**
   * ID tài khoản ngân hàng sở hữu VA
   */
  bank_account_id: string;

  /**
   * Tên gợi nhớ
   */
  label: string;

  /**
   * Email nhận thông báo
   */
  email?: string;

  /**
   * Tên điểm bán
   */
  merchant_name?: string;

  /**
   * Địa chỉ điểm bán
   */
  merchant_address?: string;

  /**
   * ID công ty
   */
  company_id?: string;

  /**
   * Số tài khoản ảo
   */
  va?: string;
}
