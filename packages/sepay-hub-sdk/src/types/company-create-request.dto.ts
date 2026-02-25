import { CompanyStatus } from "./company.dto";

/**
 * DTO đại diện cho yêu cầu tạo công ty mới.
 */
export interface CompanyCreateRequestDto {
  /**
   * Tên đầy đủ của công ty.
   */
  full_name: string;

  /**
   * Tên viết tắt của công ty.
   */
  short_name: string;

  /**
   * Trạng thái công ty.
   */
  status?: CompanyStatus;
}
