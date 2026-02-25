/**
 * DTO đại diện cho yêu cầu tra cứu tên chủ tài khoản KienLongBank
 */
export interface KlbAccountLookupRequestDto {
  /**
   * Số tài khoản ngân hàng KienLongBank
   * @example "1234567890123456"
   */
  account_number: string;
}
