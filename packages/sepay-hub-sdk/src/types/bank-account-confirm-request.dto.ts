/**
 * DTO đại diện cho yêu cầu xác nhận kết nối API ngân hàng
 */
export interface BankAccountConfirmRequestDto {
  /**
   * Mã OTP
   */
  otp: string;
}
