import { BankAccountDto } from './bank-account.dto';

/**
 * DTO đại diện cho phản hồi khi tạo tài khoản ngân hàng mới
 */
export interface BankAccountCreateResponseDto {
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
     * Thông tin tài khoản ngân hàng đã tạo
     */
    bank_account: BankAccountDto;

    /**
     * ID yêu cầu (dùng cho các bước xác nhận tiếp theo)
     */
    request_id?: string;
  };
}
