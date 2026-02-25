/**
 * DTO đại diện cho yêu cầu tra cứu thông tin chủ tài khoản
 */
export interface AccountLookupRequestDto {
  /**
   * Số tài khoản cần tra cứu
   */
  account_number: string;
}
