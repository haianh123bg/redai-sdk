/**
 * DTO đại diện cho phản hồi tạo tài khoản liên kết ngân hàng OCB
 */
export interface OcbBankAccountCreateResponseDto {
  /**
   * Mã phản hồi
   * 201: Đã thêm tài khoản ngân hàng thành công
   * 400: Thông tin đầu vào không hợp lệ
   * 4001: Số tài khoản đã tồn tại trên hệ thống SePay
   * 4002: Số CCCD/CMND không được đăng ký cho tài khoản ngân hàng OCB
   * 4003: Số điện thoại không được đăng ký cho tài khoản ngân hàng OCB
   * 4004: Số tài khoản không tồn tại trên hệ thống ngân hàng OCB
   * 504: Hệ thống OCB đang bận
   */
  code: 201 | 400 | 4001 | 4002 | 4003 | 4004 | 504;

  /**
   * Thông báo
   * - Code 201: "Đã thêm tài khoản ngân hàng thành công."
   * - Code 400: "Thông tin đầu vào không hợp lệ"
   * - Code 4001: "Số tài khoản đã tồn tại trên hệ thống SePay"
   * - Code 4002: "Số CCCD/CMND không được đăng ký cho tài khoản ngân hàng OCB"
   * - Code 4003: "Số điện thoại không được đăng ký cho tài khoản ngân hàng OCB"
   * - Code 4004: "Số tài khoản không tồn tại trên hệ thống ngân hàng OCB"
   * - Code 504: "Hệ thống OCB đang bận"
   */
  message: string;

  /**
   * ID của tài khoản ngân hàng đã tạo (chỉ có khi code = 201)
   */
  id?: string;
}
