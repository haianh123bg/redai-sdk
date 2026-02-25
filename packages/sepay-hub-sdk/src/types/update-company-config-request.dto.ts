/**
 * DTO đại diện cho yêu cầu cập nhật cấu hình công ty
 */
export interface UpdateCompanyConfigRequestDto {
  /**
   * Cấu hình nhận diện mã thanh toán
   */
  payment_code?: 'on' | 'off';

  /**
   * Cấu hình tiền tố mã thanh toán
   */
  payment_code_prefix?: string;

  /**
   * Cấu hình độ dài tối thiểu hậu tố mã thanh toán
   */
  payment_code_suffix_from?: number;

  /**
   * Cấu hình độ dài tối đa hậu tố mã thanh toán
   */
  payment_code_suffix_to?: number;

  /**
   * Cấu hình kiểu ký tự hậu tố mã thanh toán
   */
  payment_code_suffix_character_type?: 'NumberAndLetter' | 'NumberOnly';

  /**
   * Cấu hình số lượng giao dịch
   */
  transaction_amount?: number | 'Unlimited';
}
