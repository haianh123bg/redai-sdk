/**
 * DTO đại diện cho yêu cầu chỉnh sửa tài khoản ngân hàng OCB
 */
export interface OcbEditBankAccountRequestDto {
  /**
   * Tên gợi nhớ mới (tùy chọn)
   */
  label?: string;

  /**
   * Số CMND/CCCD đã dùng để đăng ký tài khoản ngân hàng OCB (tùy chọn)
   */
  identification_number?: string;

  /**
   * Số điện thoại đã dùng để đăng ký tài khoản ngân hàng OCB (tùy chọn)
   */
  phone_number?: string;
}
