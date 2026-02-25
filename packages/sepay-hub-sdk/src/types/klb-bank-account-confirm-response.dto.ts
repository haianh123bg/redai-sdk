/**
 * DTO đại diện cho phản hồi xác nhận tài khoản liên kết ngân hàng KienLongBank
 */
export interface KlbBankAccountConfirmResponseDto {
  /**
   * Mã phản hồi
   */
  code: number;

  /**
   * Thông báo
   */
  message: string;
}
