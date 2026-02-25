/**
 * DTO đại diện cho phản hồi tra cứu tên chủ tài khoản KienLongBank
 */
export interface KlbAccountLookupResponseDto {
  /**
   * Tên chủ tài khoản
   * @example "NGUYEN VAN A"
   */
  account_holder_name: string;
}
