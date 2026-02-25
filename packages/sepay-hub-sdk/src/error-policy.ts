import { SepayHubErrorCode } from "./errors";

export type SepayOperationKey =
  | "token.create"
  | "bank.list"
  | "merchant.counter"
  | "company.create"
  | "company.list"
  | "company.update"
  | "company.details"
  | "company.config.get"
  | "company.config.update"
  | "company.counter"
  | "acb.account.create"
  | "acb.account.confirm"
  | "acb.account.requestConnection"
  | "acb.account.requestDelete"
  | "acb.account.confirmDelete"
  | "acb.account.forceDelete"
  | "mb.account.lookup"
  | "mb.account.create"
  | "mb.account.confirm"
  | "mb.account.requestConnection"
  | "mb.account.requestDelete"
  | "mb.account.confirmDelete"
  | "mb.account.forceDelete"
  | "ocb.account.lookup"
  | "ocb.account.create"
  | "ocb.account.edit"
  | "ocb.va.requestCreate"
  | "ocb.va.confirmCreate"
  | "ocb.va.list"
  | "ocb.va.details"
  | "ocb.account.forceDelete"
  | "klb.account.lookup"
  | "klb.account.create"
  | "klb.account.confirm"
  | "klb.account.requestConnection"
  | "klb.account.forceDelete"
  | "klb.va.create"
  | "klb.va.enable"
  | "klb.va.disable"
  | "klb.va.list"
  | "klb.va.details"
  | "bankAccount.list"
  | "bankAccount.details"
  | "transaction.list"
  | "transaction.details";

export interface SepayBusinessErrorPolicy {
  category: SepayHubErrorCode;
  message: string;
  retryable: boolean;
}

export interface SepayOperationPolicy {
  /**
   * If declared, response.code must exist and be included in this list.
   */
  successCodes?: readonly number[];
  /**
   * If true, response.code is optional for this operation.
   */
  allowMissingCode?: boolean;
  businessErrors?: Record<number, SepayBusinessErrorPolicy>;
}

const commonBankFlowErrors: Record<number, SepayBusinessErrorPolicy> = {
  400: { category: "VALIDATION_ERROR", message: "Thông tin đầu vào không hợp lệ.", retryable: false },
  401: { category: "AUTHENTICATION_ERROR", message: "Mã truy cập không hợp lệ hoặc đã hết hạn.", retryable: false },
  403: { category: "AUTHENTICATION_ERROR", message: "Không có quyền truy cập API SePay.", retryable: false },
  409: { category: "VALIDATION_ERROR", message: "Xung đột trạng thái nghiệp vụ.", retryable: false },
  500: { category: "API_ERROR", message: "Hệ thống SePay gặp sự cố nội bộ.", retryable: true },
  504: { category: "API_ERROR", message: "Hệ thống ngân hàng đang bận, vui lòng thử lại sau.", retryable: true }
};

export const SEPAY_OPERATION_POLICY: Record<SepayOperationKey, SepayOperationPolicy> = {
  "token.create": {
    successCodes: [201],
    businessErrors: {
      401: { category: "AUTHENTICATION_ERROR", message: "Client ID/Secret không hợp lệ.", retryable: false },
      500: { category: "API_ERROR", message: "Không thể tạo access token từ SePay.", retryable: true }
    }
  },
  "bank.list": { allowMissingCode: true },
  "merchant.counter": { allowMissingCode: true },
  "company.create": {
    successCodes: [201],
    businessErrors: {
      400: { category: "VALIDATION_ERROR", message: "Dữ liệu tạo công ty không hợp lệ.", retryable: false },
      500: { category: "API_ERROR", message: "Không thể tạo công ty do lỗi SePay.", retryable: true }
    }
  },
  "company.list": { allowMissingCode: true },
  "company.update": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "company.details": { allowMissingCode: true, businessErrors: { 404: { category: "VALIDATION_ERROR", message: "Không tìm thấy công ty.", retryable: false } } },
  "company.config.get": { allowMissingCode: true, businessErrors: { 404: { category: "VALIDATION_ERROR", message: "Không tìm thấy cấu hình công ty.", retryable: false } } },
  "company.config.update": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "company.counter": { allowMissingCode: true },
  "acb.account.create": {
    successCodes: [2011, 2012],
    businessErrors: {
      ...commonBankFlowErrors,
      4001: { category: "VALIDATION_ERROR", message: "Tài khoản đã tồn tại trên SePay.", retryable: false },
      4004: { category: "VALIDATION_ERROR", message: "Tài khoản không tồn tại hoặc đã khóa trên ACB.", retryable: false },
      4005: { category: "VALIDATION_ERROR", message: "Tài khoản không thuộc nhóm khách hàng cá nhân ACB.", retryable: false },
      4006: { category: "VALIDATION_ERROR", message: "Số điện thoại chưa đăng ký với tài khoản ACB.", retryable: false },
      4007: { category: "VALIDATION_ERROR", message: "Yêu cầu quá nhiều lần, vui lòng thử lại sau 2 phút.", retryable: true }
    }
  },
  "acb.account.confirm": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "acb.account.requestConnection": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "acb.account.requestDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "acb.account.confirmDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "acb.account.forceDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "mb.account.lookup": {
    successCodes: [200],
    businessErrors: {
      ...commonBankFlowErrors,
      4001: { category: "VALIDATION_ERROR", message: "Tài khoản MB không tồn tại.", retryable: false }
    }
  },
  "mb.account.create": {
    successCodes: [2011, 2012],
    businessErrors: {
      ...commonBankFlowErrors,
      4001: { category: "VALIDATION_ERROR", message: "Tài khoản MB đã tồn tại trên SePay.", retryable: false },
      4002: { category: "VALIDATION_ERROR", message: "CCCD/CMND chưa đăng ký với tài khoản MB.", retryable: false },
      4003: { category: "VALIDATION_ERROR", message: "Số điện thoại chưa đăng ký với tài khoản MB.", retryable: false },
      4004: { category: "VALIDATION_ERROR", message: "Tài khoản MB không tồn tại.", retryable: false }
    }
  },
  "mb.account.confirm": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "mb.account.requestConnection": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "mb.account.requestDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "mb.account.confirmDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "mb.account.forceDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "ocb.account.lookup": {
    successCodes: [200],
    businessErrors: {
      ...commonBankFlowErrors,
      4001: { category: "VALIDATION_ERROR", message: "Tài khoản OCB không tồn tại.", retryable: false }
    }
  },
  "ocb.account.create": {
    successCodes: [2011, 2012],
    businessErrors: {
      ...commonBankFlowErrors,
      4001: { category: "VALIDATION_ERROR", message: "Tài khoản OCB đã tồn tại trên SePay.", retryable: false },
      4002: { category: "VALIDATION_ERROR", message: "CCCD/CMND chưa đăng ký với tài khoản OCB.", retryable: false },
      4003: { category: "VALIDATION_ERROR", message: "Số điện thoại chưa đăng ký với tài khoản OCB.", retryable: false },
      4004: { category: "VALIDATION_ERROR", message: "Tài khoản OCB không tồn tại.", retryable: false }
    }
  },
  "ocb.account.edit": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "ocb.va.requestCreate": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "ocb.va.confirmCreate": { successCodes: [201], businessErrors: commonBankFlowErrors },
  "ocb.va.list": { allowMissingCode: true },
  "ocb.va.details": { allowMissingCode: true },
  "ocb.account.forceDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "klb.account.lookup": {
    successCodes: [200],
    businessErrors: {
      ...commonBankFlowErrors,
      4001: { category: "VALIDATION_ERROR", message: "Tài khoản KienLongBank không tồn tại.", retryable: false },
      4004: { category: "VALIDATION_ERROR", message: "Tài khoản KienLongBank không tồn tại.", retryable: false }
    }
  },
  "klb.account.create": {
    successCodes: [2011, 2012],
    businessErrors: {
      ...commonBankFlowErrors,
      4001: { category: "VALIDATION_ERROR", message: "Tài khoản KLB đã tồn tại trên SePay.", retryable: false },
      4004: { category: "VALIDATION_ERROR", message: "Tài khoản KLB không tồn tại.", retryable: false }
    }
  },
  "klb.account.confirm": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "klb.account.requestConnection": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "klb.account.forceDelete": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "klb.va.create": { successCodes: [201], businessErrors: commonBankFlowErrors },
  "klb.va.enable": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "klb.va.disable": { successCodes: [200], businessErrors: commonBankFlowErrors },
  "klb.va.list": { allowMissingCode: true },
  "klb.va.details": { allowMissingCode: true },
  "bankAccount.list": { allowMissingCode: true },
  "bankAccount.details": { allowMissingCode: true },
  "transaction.list": { allowMissingCode: true },
  "transaction.details": { allowMissingCode: true }
};

export function isSuccessCode(operationKey: SepayOperationKey, code: number): boolean {
  const policy = SEPAY_OPERATION_POLICY[operationKey];
  if (!policy.successCodes || policy.successCodes.length === 0) {
    return true;
  }

  return policy.successCodes.includes(code);
}

export function getBusinessErrorPolicy(
  operationKey: SepayOperationKey,
  responseCode: number | undefined
): SepayBusinessErrorPolicy | undefined {
  if (responseCode === undefined) {
    return undefined;
  }

  const policy = SEPAY_OPERATION_POLICY[operationKey];
  return policy.businessErrors?.[responseCode];
}
