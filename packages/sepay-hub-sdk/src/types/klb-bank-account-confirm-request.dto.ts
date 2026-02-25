/**
 * DTO đại diện cho yêu cầu xác nhận tài khoản liên kết ngân hàng KienLongBank
 */
export interface KlbBankAccountConfirmRequestDto {
  /**
   * Mã OTP được gửi tới số điện thoại đã dùng để đăng ký tài khoản ngân hàng KienLongBank
   * @example "123456"
   */
  otp: string;
}
