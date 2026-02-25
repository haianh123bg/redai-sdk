/**
 * DTO đại diện cho phản hồi khi tạo access token từ SePay Hub
 */
export interface AccessTokenDto {
  /**
   * Mã trạng thái phản hồi
   */
  code: number;

  /**
   * Thông báo từ server
   */
  message: string;

  /**
   * Dữ liệu phản hồi
   */
  data: {
    /**
     * Access token
     */
    access_token: string;

    /**
     * Thời gian sống của token (giây)
     */
    ttl: number;
  };
}
