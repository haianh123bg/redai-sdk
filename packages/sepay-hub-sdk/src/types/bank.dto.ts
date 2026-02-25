/**
 * DTO đại diện cho thông tin ngân hàng từ SePay Hub
 */
export interface BankDto {
  /**
   * ID ngân hàng
   */
  id: string;

  /**
   * Tên ngân hàng
   */
  brand_name: string;

  /**
   * Tên đầy đủ ngân hàng
   */
  full_name: string;

  /**
   * Tên ngắn gọn ngân hàng
   */
  short_name: string;

  /**
   * Mã ngân hàng
   */
  code: string;

  /**
   * Bin ngân hàng
   */
  bin: string;

  /**
   * URL Logo ngân hàng
   */
  logo_path: string;

  /**
   * URL Icon ngân hàng
   */
  icon: string;

  /**
   * Trạng thái ngân hàng được hỗ trợ bởi SePay
   */
  active: '1' | '0';
}
