/**
 * Enum đại diện cho các kiểu ký tự hậu tố mã thanh toán
 */
export enum PaymentCodeSuffixCharacterType {
  NUMBER_AND_LETTER = 'NumberAndLetter',
  NUMBER_ONLY = 'NumberOnly',
}

/**
 * DTO đại diện cho cấu hình công ty (tổ chức) từ SePay Hub
 */
export interface CompanyConfigDto {
  /**
   * Cấu hình nhận diện mã thanh toán
   */
  payment_code: 'on' | 'off';

  /**
   * Cấu hình tiền tố mã thanh toán
   */
  payment_code_prefix: string;

  /**
   * Cấu hình độ dài tối thiểu hậu tố mã thanh toán
   */
  payment_code_suffix_from: number;

  /**
   * Cấu hình độ dài tối đa hậu tố mã thanh toán
   */
  payment_code_suffix_to: number;

  /**
   * Cấu hình kiểu ký tự hậu tố mã thanh toán
   * - NumberAndLetter: Cho phép chữ cái và số
   * - NumberOnly: Chỉ cho phép chữ số
   */
  payment_code_suffix_character_type: PaymentCodeSuffixCharacterType;

  /**
   * Cấu hình số lượng giao dịch
   * Số lượng giao dịch có thể là số nguyên dương không âm hoặc giá trị chuỗi "Unlimited" (không giới hạn)
   */
  transaction_amount: number | 'Unlimited';
}
