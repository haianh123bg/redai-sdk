/**
 * Response types for InfoDoanhNghiep API
 */

export interface CompanyInfo {
    /** Tên công ty */
    name: string;
    /** Mã số thuế */
    taxCode: string;
    /** Đại diện pháp luật */
    legalRepresentative: string;
    /** Địa chỉ */
    address: string;
    /** Tỉnh/Thành phố */
    city: string;
    /** Ngày thành lập */
    establishedDate: string;
    /** Link chi tiết */
    detailUrl: string;
}

export interface LookupResponse {
    /** Danh sách doanh nghiệp tìm thấy */
    companies: CompanyInfo[];
    /** Tổng số kết quả */
    totalResults: number;
}
