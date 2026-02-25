/**
 * DTO đại diện cho phản hồi tra cứu tên chủ tài khoản MB Bank
 */
export interface MbAccountLookupResponseDto {
  /**
   * Mã phản hồi
   * 200: Tra cứu thành công
   * 400: Thông tin đầu vào không hợp lệ
   * 4001: Số tài khoản không tồn tại trên hệ thống ngân hàng MB Bank
   * 504: Hệ thống MB Bank đang bận
   */
  code: 200 | 400 | 4001 | 504;

  /**
   * Thông báo
   * - Code 200: "Tra cứu thành công"
   * - Code 400: "Thông tin đầu vào không hợp lệ"
   * - Code 4001: "Số tài khoản không tồn tại trên hệ thống ngân hàng MB Bank"
   * - Code 504: "Hệ thống MB Bank đang bận"
   */
  message: string;

  /**
   * Dữ liệu trả về (chỉ có khi thành công)
   */
  data?: {
    /**
     * Tên chủ tài khoản
     */
    account_holder_name: string;
  };
}
