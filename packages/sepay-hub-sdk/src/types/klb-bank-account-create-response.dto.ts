/**
 * DTO đại diện cho phản hồi tạo tài khoản liên kết ngân hàng KienLongBank
 */
export interface KlbBankAccountCreateResponseDto {
  /**
   * Mã phản hồi
   * 2011: Thêm tài khoản thành công, cần OTP xác thực
   * 2012: Liên kết API tài khoản thành công
   */
  code: 2011 | 2012;

  /**
   * Thông báo
   */
  message: string;

  /**
   * ID của tài khoản ngân hàng đã tạo
   */
  id: string;

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
