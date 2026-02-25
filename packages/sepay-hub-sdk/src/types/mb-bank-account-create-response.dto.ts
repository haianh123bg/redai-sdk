/**
 * DTO đại diện cho phản hồi tạo tài khoản liên kết ngân hàng MB Bank
 */
export interface MbBankAccountCreateResponseDto {
  /**
   * Mã phản hồi
   * 2011: Thêm tài khoản thành công, cần OTP xác thực liên kết API
   * 2012: Liên kết API tài khoản thành công
   * 400: Thông tin đầu vào không hợp lệ
   * 4001: Số tài khoản đã tồn tại trên hệ thống SePay
   * 4002: Số CCCD/CMND không được đăng ký cho tài khoản ngân hàng MB Bank
   * 4003: Số điện thoại không được đăng ký cho tài khoản ngân hàng MB Bank
   * 4004: Số tài khoản không tồn tại trên hệ thống ngân hàng MB Bank
   * 504: Hệ thống MB Bank đang bận
   */
  code: 2011 | 2012 | 400 | 4001 | 4002 | 4003 | 4004 | 504;

  /**
   * Thông báo
   * - Code 2011: "Đã thêm tài khoản ngân hàng và gửi OTP xác thực liên kết API."
   * - Code 2012: "Đã liên kết API tài khoản ngân hàng thành công."
   * - Code 400: "Thông tin đầu vào không hợp lệ"
   * - Code 4001: "Số tài khoản đã tồn tại trên hệ thống SePay"
   * - Code 4002: "Số CCCD/CMND không được đăng ký cho tài khoản ngân hàng MB Bank"
   * - Code 4003: "Số điện thoại không được đăng ký cho tài khoản ngân hàng MB Bank"
   * - Code 4004: "Số tài khoản không tồn tại trên hệ thống ngân hàng MB Bank"
   * - Code 504: "Hệ thống MB Bank đang bận"
   */
  message: string;

  /**
   * ID của tài khoản ngân hàng đã tạo (chỉ có khi thành công)
   */
  id?: string;

  /**
   * Dữ liệu bổ sung (chỉ có khi code = 2011)
   */
  data?: {
    /**
     * ID yêu cầu để xác thực OTP
     */
    request_id: string;
  };
}
