/**
 * Response types for TracuuVinHoadon API
 */

// ============ Base Response Types ============

export interface AbpBaseResponse<T> {
    result: T;
    targetUrl: string | null;
    success: boolean;
    error: AbpError | null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
}

export interface AbpError {
    code: number;
    message: string;
    details: string | null;
    validationErrors: ValidationError[] | null;
}

export interface ValidationError {
    message: string;
    members: string[];
}

// ============ RefreshCaptcha Types ============

export interface RefreshCaptchaResult {
    status: number;
    html: string | null;
    message: string | null;
    key: string;
    image: string;
    fileStatus: number;
    fileData: string | null;
    base64: string | null;
    dnMua_Mst: string | null;
    dsChungThu: ChungThu[];
    hoaDon: HoaDon | null;
}

export type RefreshCaptchaResponse = AbpBaseResponse<RefreshCaptchaResult>;

// ============ TraCuu Types ============

export interface TraCuuParams {
    key: string;
    captcha: string;
    maSoBiMat: string;
}

export interface FileData {
    fileName: string;
    fileType: string;
    fileToken: string;
    fileData: string;
}

export interface ChungThu {
    mst: string;
    hanTu: string;
    hanDen: string;
    tenDonVi: string;
    nhaCungCap: string;
    file: string;
    hanTu_Str: string | null;
    hanDen_Str: string | null;
    serial: string | null;
}

export interface TraCuuResult {
    status: number;
    html: string | null;
    message: string;
    key: string;
    image: string | null;
    fileStatus: number;
    fileData: FileData | null;
    filePdf: FileData | null;
    base64: string;
    dataPng: string | null;
    dnMua_Mst: string | null;
    dsChungThu: ChungThu[];
    hoaDon: HoaDon | null;
    chungTu: string | null;
    maSoBiMat: string;
    username: string | null;
    nodeToSign_Name: string;
    signNode_Name: string;
}

export type TraCuuResponse = AbpBaseResponse<TraCuuResult>;

// ============ Cloudinary Types ============

export interface CloudinaryImageUploadResponse {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
}

export interface CloudinaryRawUploadResponse {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
}

// ============ HoaDon Types ============

export interface SanPham {
    sanPham_Ma: string | null;
    sanPham_Ten: string;
    sanPham_MaNhom: string | null;
    sanPham_DvMoi_Ma: string | null;
    sanPham_DonViTinh: string | null;
    sanPham_Gia: number;
    sanPham_ThueSuat: number | null;
    sanPham_TienThue: number | null;
    sanPham_MaThueSuat: string | null;
    sanPham_GhiChu: string | null;
    tuyenDuong: string | null;
    tuyenDuong_Ten: string | null;
    sanPham_DiemDi: string | null;
    sanPham_DiemDen: string | null;
    sanPham_TrangThai: boolean;
    doanhNghiep_MST: string | null;
    luuSanPham_Gia: number | null;
    dienGiai: string | null;
    taiKhoan_No: string | null;
    taiKhoan_Dt: string | null;
    taiKhoan_Vt: string | null;
    taiKhoan_GiaVon: string | null;
    taiKhoan_Thue: string | null;
    sanPham_LoaiTemVe: string | null;
    sanPham_GiaSauThue: number | null;
    sanPham_GiaThucThu: number | null;
    sanPham_ThueGiam: number | null;
    sanPham_GiaSauThueString: string | null;
    sanPham_GiaString: string | null;
    sanPham_TienThueString: string | null;
    loaiVe: string | null;
    sanPham_TuNgay: string | null;
    sanPham_DenNgay: string | null;
    sanPham_GiaSauThue_SauDieuChinh: number | null;
    sanPham_GiaSauThue_SauDieuChinh_String: string | null;
    sanPham_Ma_Ten: string;
    chuoiSanPham_Gia: string;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string | null;
    lastModifierUserId: number | null;
    creationTime: string;
    creatorUserId: number | null;
    id: number | null;
}

export interface ThueSuat {
    stt: number;
    thueSuat_Ma: number;
    thueSuat_Ma_Cqt: string | null;
    thueSuat_Ten: string | null;
    thueSuat_GiaTri: number;
    thueSuat_HieuLuc: boolean;
    thueSuat_BatDau: string | null;
    thueSuat_KetThuc: string | null;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string | null;
    lastModifierUserId: number | null;
    creationTime: string;
    creatorUserId: number | null;
    id: number | null;
}

export interface ChiTiet {
    tongHop_Id: number;
    hoaDon_So: string | null;
    stt: number;
    hangHoa_Ma: string | null;
    hangHoa_Ten: string;
    donViTinh_Ma: string | null;
    donViTinh_Ten: string;
    hangHoa_DonGia: number;
    hangHoa_GiaSauThue: number | null;
    hangHoa_SoLuong: number;
    hangHoa_SoLuong_Nhap: number | null;
    hangHoa_SoLuong_Xuat: number | null;
    chietKhau_PhanTram: number;
    tongTien_ChietKhau: number | null;
    tongTien_ChuaThue: number;
    tongTien_CoThue: number;
    hangHoa_MaThue: number;
    hangHoa_Thue: number;
    hangHoa_TenThue: string | null;
    tongTien_Thue: number;
    khuyenMai: boolean;
    tongTien_DieuChinh: number | null;
    tongTien_ThueDieuChinh: number | null;
    dieuChinh_TangGiam: boolean | null;
    hangHoa_Loai: number;
    vanChuyen_Loai: string | null;
    tongTien_Hang: number;
    phikhac_tyle: number | null;
    phikhac_sotien: number | null;
    phikhacsauthue_sotien: number | null;
    bS_ChiTiet_01: string | null;
    bS_ChiTiet_02: string | null;
    bS_ChiTiet_03: string | null;
    bS_ChiTiet_04: string | null;
    bS_ChiTiet_05: string | null;
    bS_ChiTiet_06: string | null;
    bS_ChiTiet_07: string | null;
    bS_ChiTiet_08: string | null;
    bS_ChiTiet_09: string | null;
    bS_ChiTiet_10: string | null;
    sttBangTongHop: number;
    sanPham: SanPham;
    thueSuat: ThueSuat;
    ghiChu: string | null;
    doanhNghiep_MST: string;
    tenantId: number;
    hangHoa_Ten_Tmp: string | null;
    ma_Kho: string | null;
    mau_HoaDon_Loai: string | null;
    dvtTe: string | null;
    tGia: number | null;
    kdldchinh: string | null;
    lstHoaDonId: string | null;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string;
    lastModifierUserId: number;
    creationTime: string;
    creatorUserId: number;
    id: number;
}

export interface TongHopThueSuat {
    tongHop_Id: number;
    hoaDon_So: string | null;
    maThue: number;
    mucThue: number;
    tenThue: string | null;
    tongTien_ChiuThue: number;
    tongTien_Thue: number;
    dieuChinh_TangGiam: boolean | null;
    lyDoGiamThue: string | null;
    doanhNghiep_MST: string;
    tenantId: number;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string | null;
    lastModifierUserId: number | null;
    creationTime: string;
    creatorUserId: number;
    id: number;
}

export interface ThongBaoMauHD {
    hdMau_Ma: string;
    hdMau_Ten: string;
    hdMau_KyHieu: string;
    hdMau_XSLT: string;
    hdMau_XSLT_Pos: string | null;
    nhieuHangHoa: boolean | null;
    hdMau_XSLT_Path: string | null;
    hdMau_XSLT_Pos_Path: string | null;
    hdMau_XML: string;
    hdMau_XML_Path: string | null;
    hD_ThongTu: string;
    loaiHoaDon_MauSo: string;
    loaiHoaDon_Ten: string;
    loai_HD_DacThu: string;
    thongBao_SoLuong: number;
    thongBao_TuSo: number;
    thongBao_DenSo: number;
    thongBao_NgaySuDung: string;
    thongBao_Id: number;
    suDung_TrangThai: number;
    suDung_SoHienTai: number;
    loaiHoaDon: string | null;
    mauHD_Loai: number;
    mauHDGoc_Id: number | null;
    giuSo_TuNgay: string | null;
    giuSo_DenNgay: string | null;
    capSo_TrangThai: number;
    capSo_NgayCho: string;
    capSo_NgayHD: string;
    tct_HoatDong: boolean | null;
    tct_Link: string | null;
    tct_TaiKhoan: string | null;
    tct_BaoMat: string | null;
    phongBan: string | null;
    quanLy_Xsl_Version: string;
    maxLength_Line: number | null;
    maxRow_Page: number;
    maxRow_FullPage: number;
    tct_NgayApDung: string | null;
    doanhNghiep_MST: string;
    tenantId: number;
    loaiHangHoa: string | null;
    checkDelete: boolean | null;
    isLockout: boolean | null;
    hopDongIn: string | null;
    hdMau_IsLayoutLandscape: boolean | null;
    hdMau_ChiTiet_HienThiTyLePhiKhac: boolean | null;
    hdMau_ChiTiet_HienThiPhiKhac: boolean | null;
    hdMau_TongHop_HienThiTyLePhiKhac: boolean | null;
    hdMau_TongHop_HienThiPhiKhac: boolean | null;
    hdMau_TongHop_HienThiPhiKhacSauThue: boolean;
    hdMau_TongHop_HienThiThueKhac: boolean;
    hdMau_ChiTiet_HienThiPhiKhacSauThue: boolean | null;
    hdMau_TongHop_HienThiChietKhauSauThue: boolean | null;
    hdMau_HienThiTienPhi1: boolean;
    hdMau_HienThiTienPhi2: boolean;
    hdMau_HienThiQuyDoiVND: boolean | null;
    hD_MTTien: string | null;
    tct_HinhThuc_GuiHd: string | null;
    pos_Serial: string | null;
    pos_MauVe_TEXT: string | null;
    pos_LoaiMau: string | null;
    pos_MauVe_XSLT: string | null;
    soHienTai: number;
    hdMau_PaperSize: number;
    hdMau_XSLTData: string | null;
    pos_MauVe_XSLTData: string | null;
    pos_MauVe_TEXTData: string | null;
    doanhNghiep_Ten: string | null;
    doanhNghiep_DiaChi: string | null;
    temVe_SanPham: string | null;
    hdmau_SanPham: string | null;
    hdmau_QrcodeCang: string | null;
    lhhdTrung: string | null;
    thongBao_DenSoStr: string;
    thongBao_TuSoStr: string;
    hinhThucStr: string;
    firstMauSo: string;
    lastMauSo: string;
    hdMauString: string;
    hdMauGocString: string;
    setPhongBan: string | null;
    setSanPham: string | null;
    dsTruongMoRong: string | null;
    dsTruongMoRongCT: string | null;
    dsTruongLuuText: string | null;
    xuatHD_LuuTam: boolean | null;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string;
    lastModifierUserId: number;
    creationTime: string;
    creatorUserId: number;
    id: number;
}

export interface HoaDon {
    mau_HinhThucNhap: number;
    mau_HeThongKhacId: string | null;
    mau_LoaiHoaDon_Ma: string | null;
    mau_Loai_HD_DacThu: string | null;
    mau_HDMau_Id: number;
    mau_HDMau_Ma: string;
    mau_MauSo: string;
    mau_KyHieu: string;
    mau_So: string;
    mau_Ten: string;
    mau_NgayLap: string;
    mau_NgayLap_String_Input: string | null;
    mau_NgayKy: string;
    mau_NguoiLap: string;
    mau_NguoiKy: string;
    mau_NguoiLap_UserId: number;
    mau_NguoiKy_UserId: number;
    mau_HopDong_So: string | null;
    mau_HopDong_NgayKy: string | null;
    mau_HopDong_LyDo: string | null;
    mau_TienTe_Ma: string;
    mau_TyGiaNgoaiTe: number | null;
    mau_TyGiaQuyDoiVND: number | null;
    tongHop_TongTien_QuyDoiVND_Chu: string | null;
    mau_GhiChu: string | null;
    mau_HoaDon_Loai: number;
    mau_HDGoc_Id: number | null;
    mau_InTrongMotTrang: boolean | null;
    mau_Trang_SoDong: number | null;
    mau_TrangCuoi_SoDong: number | null;
    dnBan_MST: string;
    dnBan_Ten: string;
    dnBan_DiaChi: string;
    dnBan_SDT: string;
    dnBan_FAX: string;
    dnBan_Email: string;
    dnBan_NganHang_TaiKhoan: string;
    dnBan_NganHang_TruSo: string;
    dnBan_NguoiDaiDien: string;
    dnBan_Website: string;
    dnMua_Ma: string | null;
    dnMua_TenNguoiMua: string;
    dnMua_Ten: string | null;
    dnMua_MST: string | null;
    dnMua_DiaChi: string;
    dnMua_SDT: string | null;
    dnMua_Mqhns: string | null;
    dnMua_Email: string | null;
    dnMua_NganHang_TaiKhoan: string | null;
    dnMua_NganHang_TruSo: string | null;
    dnMua_TrangThaiKy: number;
    dnMua_TrangThai: string | null;
    dnMua_NguoiKy: string | null;
    dnMua_KhachHang_Ma: string | null;
    dnMua_CCCD: string | null;
    dnMua_HoChieu: string | null;
    dnMua_NgayKy: string | null;
    thanhToan_PhuongThuc: number;
    thanhToan_PhuongThuc_Ten: string;
    thanhToan_GhiChu: string | null;
    thanhToan_SoTien: number | null;
    thanhToan_Ngay: string | null;
    thanhToan_TongTien: number;
    thanhToan_ThoiHan: string | null;
    thanhToan_NganHang: string | null;
    thanhToan_TaiKhoan: string | null;
    thanhToan_TrangThai: string | null;
    vanChuyen_So: string | null;
    vanChuyen_NgayXuat: string | null;
    vanChuyen_DieuDong: string | null;
    vanChuyen_GiaoHang: string | null;
    vanChuyen_KhoXuat: string | null;
    vanChuyen_KhoNhap: string | null;
    vanChuyen_PhuongThuc: string | null;
    vanChuyen_LyDo: string | null;
    vanChuyen_Lenh: string | null;
    vanChuyen_NguoiXuat: string | null;
    vanChuyen_NguoiNhan: string | null;
    vanChuyen_HopDongKinhTe: string | null;
    vanChuyen_HopDongNgay: string | null;
    tongHop_TongTien_GTKCThue: number | null;
    tongHop_TongTien_GTKhac: number | null;
    tongHop_TongTien_ChuaVAT: number;
    tongHop_TongTien_KhoanKhac: number;
    tongHop_TienThue: number;
    tongHop_TongTien_CoVAT: number;
    tongHop_NgoaiTe_CoVAT: number;
    tongHop_TienChietKhau_SauThue: number | null;
    tongHop_TongTien_CoVAT_Chu: string;
    tongHop_TongTien_ChuaVAT_TangGiam: number | null;
    tongHop_TongTien_CoVAT_TangGiam: number | null;
    tongHop_TienThue_TangGiam: number | null;
    tongHop_TongTien_KhoanKhac_TangGiam: boolean;
    tcT_TrangThai: number;
    tcT_MaGiaoDich: string;
    tcT_MaHoaDon: string;
    quanLy_ChuyenDoi: boolean;
    quanLy_ChuyenDoi_Ngay: string | null;
    quanLy_ChuyenDoi_NguoiChuyenDoi: string | null;
    quanLy_TrangThai: number;
    quanLy_GuiEmail: number;
    quanLy_GuiEmail_LanDau: string | null;
    quanLy_SoBaoMat: string;
    quanLy_VanBanThoaThuan: string | null;
    quanLy_VanBan_Id: number | null;
    quanLy_VanBanThoaThuan_Sua: boolean;
    quanLy_VanBanThoaThuan_Data: string | null;
    quanLy_VanBanThoaThuan_Html: string | null;
    vanBanTtId: number;
    isViewInvoice: boolean;
    tongHop_TienHang: number | null;
    tongHop_TienChietKhau: number | null;
    phikhac_tyle: number | null;
    phikhac_sotien: number | null;
    phikhacsauthue_sotien: number | null;
    thuekhac_sotien: number | null;
    tongHop_TienThueGTGTGiam: number | null;
    tongHop_ThueDoanhThu: number | null;
    tienPhi1_SoTien: number | null;
    tienPhi2_SoTien: number | null;
    tenTienPhi1: string | null;
    tenTienPhi2: string | null;
    btsC_SQDinh: string | null;
    btsC_NQDinh: string | null;
    btsC_CQBHQDinh: string | null;
    btsC_HTBan: string | null;
    btsC_DDVCDen: string | null;
    btsC_TGVCDTu: string | null;
    btsC_TGVCDDen: string | null;
    bS_ThongTin_DNMua_01: string | null;
    bS_ThongTin_DNMua_02: string | null;
    bS_ThongTin_DNMua_03: string | null;
    bS_ThongTin_DNMua_04: string | null;
    bS_ThongTin_DNMua_05: string | null;
    bS_ThongTin_DNMua_06: string | null;
    bS_ThongTin_DNMua_07: string | null;
    bS_ThongTin_DNMua_08: string | null;
    bS_ThongTin_DNMua_09: string | null;
    bS_ThongTin_DNMua_10: string | null;
    lydo: string | null;
    tctbao: string | null;
    hoaDonGoc: HoaDon | null;
    khachHang: string | null;
    khachHangCN: string | null;
    hD_ThongBao_MauHD: ThongBaoMauHD;
    dsChiTiet: ChiTiet[];
    dsThueSuat: TongHopThueSuat[];
    dsKySo: string[];
    hdBienBanThoaThuanDto: string | null;
    hoSoId: number | null;
    doanhNghiep_MST: string;
    tenantId: number;
    nguoiXoa: string | null;
    ngayXoa: string | null;
    id_DNMua_NganHang_TaiKhoan: string | null;
    mau_HDKhacGoc_Id: number | null;
    hdGoc: string | null;
    hdGoc_MauSo: string | null;
    hdGoc_KyHieu: string | null;
    hdGoc_So: string | null;
    hangHoa_TenThue1: string | null;
    dsTruongMoRong: string | null;
    xemBanNhap: boolean | null;
    stt_Bth: number | null;
    inNhiet: boolean;
    mauSo_KyHieu: string;
    mau_NgayLap_String_SaiSot: string;
    mau_NgayLap_String_Ds: string;
    soHoaDonDinhDang: string;
    chungThu_Serial: string | null;
    checkHsm: boolean | null;
    tongHop_TongTien_CoVat_Str: string;
    nguoiThucHien: string | null;
    ghiChu_BcTemVe: string | null;
    sanPhamTemVe_Ten: string | null;
    phuXe_Ten: string | null;
    isDeleted: boolean;
    deleterUserId: number | null;
    deletionTime: string | null;
    lastModificationTime: string;
    lastModifierUserId: number;
    creationTime: string;
    creatorUserId: number;
    id: number;
}
