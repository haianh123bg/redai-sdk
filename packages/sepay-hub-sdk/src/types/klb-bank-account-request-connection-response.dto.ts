/**
 * DTO đại diện cho phản hồi yêu cầu liên kết tài khoản ngân hàng KienLongBank
 */
export interface KlbBankAccountRequestConnectionResponseDto {
  /**
   * Mã phản hồi
   */
  code: number;

  /**
   * Thông báo
   */
  message: string;

  /**
   * Dữ liệu bổ sung
   */
  data: {
    /**
     * ID yêu cầu để xác thực OTP
     */
    request_id: string;
  };
}
