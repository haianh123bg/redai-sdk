import {
  AccessTokenDto,
  AccountLookupRequestDto,
  AcbBankAccountCreateRequestDto,
  AcbBankAccountCreateResponseDto,
  BankAccountConfirmRequestDto,
  BankAccountCreateRequestDto,
  BankAccountDto,
  BankDto,
  CompanyConfigDto,
  CompanyCreateRequestDto,
  CompanyDto,
  CompanyListQueryDto,
  CompanyUpdateRequestDto,
  CreateVARequestDto,
  KlbAccountLookupRequestDto,
  KlbAccountLookupResponseDto,
  KlbBankAccountConfirmRequestDto,
  KlbBankAccountConfirmResponseDto,
  KlbBankAccountCreateRequestDto,
  KlbBankAccountCreateResponseDto,
  KlbBankAccountRequestConnectionResponseDto,
  KlbVADetailsResponseDto,
  MbAccountLookupResponseDto,
  MbBankAccountCreateResponseDto,
  OcbBankAccountCreateRequestDto,
  OcbBankAccountCreateResponseDto,
  OcbEditBankAccountRequestDto,
  OtpRequestDto,
  TransactionCounterDto,
  TransactionHistoryDto,
  UpdateCompanyConfigRequestDto,
  VaListQueryDto,
  BankAccountListQueryDto,
  TransactionListQueryDto,
  VirtualAccountDto
} from "./types";
import { RequestOptions, SepayHubClient, SepayHubClientOptions, SepayApiEnvelope, SepayApiPaginationMeta } from "./client";
import { SepayHubError } from "./errors";

export interface SepayOperationResult {
  code: number;
  message: string;
  id?: string;
  request_id?: string;
}

export interface SepayPaginatedResult<TItem> {
  items: TItem[];
  meta: SepayApiPaginationMeta;
}

export interface SepayDetailResult<TData> {
  item: TData;
}

export interface SepayCounterAggregate {
  transaction: string;
  transaction_in: string;
  transaction_out: string;
}

export interface SepayCounterResponseData {
  dates: TransactionCounterDto[];
  total: SepayCounterAggregate;
}

export class SepayHubService {
  private readonly client: SepayHubClient;

  readonly company = {
    create: (payload: CompanyCreateRequestDto) => this.createCompany(payload),
    list: (query?: CompanyListQueryDto) => this.getCompanies(query),
    update: (companyId: string, payload: CompanyUpdateRequestDto) => this.updateCompany(companyId, payload),
    details: (companyId: string) => this.getCompanyDetails(companyId),
    getConfig: (companyId: string) => this.getCompanyConfiguration(companyId),
    updateConfig: (companyId: string, payload: UpdateCompanyConfigRequestDto) =>
      this.updateCompanyConfiguration(companyId, payload),
    counter: (companyId: string, date?: string) => this.getCompanyCounter(companyId, date)
  };

  readonly acb = {
    createAccount: (payload: AcbBankAccountCreateRequestDto) => this.createAcbBankAccount(payload),
    confirmAccount: (requestId: string, payload: BankAccountConfirmRequestDto) =>
      this.confirmAcbBankAccount(requestId, payload),
    requestConnection: (bankAccountId: string) => this.requestAcbApiConnection(bankAccountId),
    requestDelete: (bankAccountId: string) => this.requestAcbDelete(bankAccountId),
    confirmDelete: (requestId: string, payload: OtpRequestDto) => this.confirmAcbDelete(requestId, payload),
    forceDelete: (bankAccountId: string) => this.forceDeleteAcbBankAccount(bankAccountId)
  };

  readonly mb = {
    lookupAccountHolder: (payload: AccountLookupRequestDto) => this.lookupMbAccountHolderName(payload),
    createAccount: (payload: BankAccountCreateRequestDto) => this.createMbBankAccount(payload),
    confirmAccount: (requestId: string, payload: BankAccountConfirmRequestDto) =>
      this.confirmMbBankAccount(requestId, payload),
    requestConnection: (bankAccountId: string) => this.requestMbApiConnection(bankAccountId),
    requestDelete: (bankAccountId: string) => this.requestMbDelete(bankAccountId),
    confirmDelete: (requestId: string, payload: OtpRequestDto) => this.confirmMbDelete(requestId, payload),
    forceDelete: (bankAccountId: string) => this.forceDeleteMbBankAccount(bankAccountId)
  };

  readonly ocb = {
    lookupAccountHolder: (payload: AccountLookupRequestDto) => this.lookupOcbAccountHolderName(payload),
    createAccount: (payload: OcbBankAccountCreateRequestDto) => this.createOcbBankAccount(payload),
    editAccount: (bankAccountId: string, payload: OcbEditBankAccountRequestDto) =>
      this.editOcbBankAccount(bankAccountId, payload),
    requestCreateVa: (payload: CreateVARequestDto) => this.requestCreateOcbVa(payload),
    confirmCreateVa: (requestId: string, payload: OtpRequestDto) => this.confirmCreateOcbVa(requestId, payload),
    listVa: (query?: VaListQueryDto) => this.listOcbVa(query),
    getVaDetails: (vaId: string) => this.getOcbVaDetails(vaId),
    forceDeleteAccount: (bankAccountId: string) => this.forceDeleteOcbBankAccount(bankAccountId)
  };

  readonly klb = {
    lookupAccountHolder: (payload: KlbAccountLookupRequestDto) => this.lookupKlbAccountHolderName(payload),
    createAccount: (payload: KlbBankAccountCreateRequestDto) => this.createKlbBankAccount(payload),
    confirmAccount: (requestId: string, payload: KlbBankAccountConfirmRequestDto) =>
      this.confirmKlbBankAccount(requestId, payload),
    requestConnection: (bankAccountId: string) => this.requestKlbApiConnection(bankAccountId),
    forceDeleteAccount: (bankAccountId: string) => this.forceDeleteKlbBankAccount(bankAccountId),
    createVa: (payload: CreateVARequestDto) => this.createKlbVa(payload),
    enableVa: (vaId: string) => this.enableKlbVa(vaId),
    disableVa: (vaId: string) => this.disableKlbVa(vaId),
    listVa: (query?: VaListQueryDto) => this.listKlbVa(query),
    getVaDetails: (vaId: string) => this.getKlbVaDetails(vaId)
  };

  readonly bankAccount = {
    list: (query?: BankAccountListQueryDto) => this.listBankAccounts(query),
    details: (bankAccountId: string) => this.getBankAccountDetails(bankAccountId)
  };

  readonly transaction = {
    list: (query?: TransactionListQueryDto) => this.listTransactions(query),
    details: (transactionId: string) => this.getTransactionDetails(transactionId)
  };

  constructor(options: SepayHubClientOptions | SepayHubClient) {
    this.client = options instanceof SepayHubClient ? options : new SepayHubClient(options);
  }

  async createAccessToken(): Promise<AccessTokenDto["data"]> {
    return this.client.createAccessToken();
  }

  async getBanks(): Promise<BankDto[]> {
    const response = await this.client.get<BankDto[]>("/bank", this.req("lấy danh sách ngân hàng", "bank.list"));
    return this.ensureData(response, "lấy danh sách ngân hàng");
  }

  async getMerchantCounter(date?: string): Promise<SepayCounterResponseData> {
    const response = await this.client.get<SepayCounterResponseData>(
      "/merchant/counter",
      this.req("truy vấn bộ đếm giao dịch merchant", "merchant.counter", date ? { date } : undefined)
    );

    return this.ensureData(response, "truy vấn bộ đếm giao dịch merchant");
  }

  async createCompany(payload: CompanyCreateRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, CompanyCreateRequestDto>(
      "/company/create",
      payload,
      this.req("tạo công ty", "company.create")
    );

    return this.ensureOperation(response, "tạo công ty");
  }

  async getCompanies(query?: CompanyListQueryDto): Promise<SepayPaginatedResult<CompanyDto>> {
    const response = await this.client.get<CompanyDto[]>(
      "/company",
      this.req("truy vấn danh sách công ty", "company.list", this.toParams(query))
    );

    return this.ensureList(response, "truy vấn danh sách công ty");
  }

  async updateCompany(companyId: string, payload: CompanyUpdateRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, CompanyUpdateRequestDto>(
      `/company/edit/${companyId}`,
      payload,
      this.req("cập nhật công ty", "company.update")
    );

    return this.ensureOperation(response, "cập nhật công ty");
  }

  async getCompanyDetails(companyId: string): Promise<SepayDetailResult<CompanyDto>> {
    const response = await this.client.get<CompanyDto>(
      `/company/details/${companyId}`,
      this.req("truy vấn chi tiết công ty", "company.details")
    );

    return { item: this.ensureData(response, "truy vấn chi tiết công ty") };
  }

  async getCompanyConfiguration(companyId: string): Promise<SepayDetailResult<CompanyConfigDto>> {
    const response = await this.client.get<CompanyConfigDto>(
      `/company/configuration/${companyId}`,
      this.req("truy vấn cấu hình công ty", "company.config.get")
    );

    return { item: this.ensureData(response, "truy vấn cấu hình công ty") };
  }

  async updateCompanyConfiguration(
    companyId: string,
    payload: UpdateCompanyConfigRequestDto
  ): Promise<SepayOperationResult> {
    const response = await this.client.post<never, UpdateCompanyConfigRequestDto>(
      `/company/configuration/${companyId}`,
      payload,
      this.req("cập nhật cấu hình công ty", "company.config.update")
    );

    return this.ensureOperation(response, "cập nhật cấu hình công ty");
  }

  async getCompanyCounter(companyId: string, date?: string): Promise<SepayCounterResponseData> {
    const response = await this.client.get<SepayCounterResponseData>(
      `/company/counter/${companyId}`,
      this.req("truy vấn bộ đếm công ty", "company.counter", date ? { date } : undefined)
    );

    return this.ensureData(response, "truy vấn bộ đếm công ty");
  }

  async createAcbBankAccount(payload: AcbBankAccountCreateRequestDto): Promise<AcbBankAccountCreateResponseDto> {
    const response = await this.client.post<AcbBankAccountCreateResponseDto, AcbBankAccountCreateRequestDto>(
      "/acb/individual/bankAccount/create",
      payload,
      this.req("thêm tài khoản ACB", "acb.account.create")
    );

    return this.ensureEnvelopeAs<AcbBankAccountCreateResponseDto>(response, "thêm tài khoản ACB");
  }

  async confirmAcbBankAccount(requestId: string, payload: BankAccountConfirmRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, BankAccountConfirmRequestDto>(
      "/acb/individual/bankAccount/confirmApiConnection",
      payload,
      this.req("xác nhận liên kết ACB", "acb.account.confirm", undefined, this.ensureRequestId(requestId))
    );

    return this.ensureOperation(response, "xác nhận liên kết ACB");
  }

  async requestAcbApiConnection(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/acb/individual/bankAccount/requestApiConnection/${bankAccountId}`, "yêu cầu liên kết ACB", "acb.account.requestConnection");
  }

  async requestAcbDelete(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/acb/individual/bankAccount/requestDelete/${bankAccountId}`, "yêu cầu xóa liên kết ACB", "acb.account.requestDelete");
  }

  async confirmAcbDelete(requestId: string, payload: OtpRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, OtpRequestDto>(
      "/acb/individual/bankAccount/confirmDelete",
      payload,
      this.req("xác nhận xóa liên kết ACB", "acb.account.confirmDelete", undefined, this.ensureRequestId(requestId))
    );

    return this.ensureOperation(response, "xác nhận xóa liên kết ACB");
  }

  async forceDeleteAcbBankAccount(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/acb/individual/bankAccount/forceDelete/${bankAccountId}`, "xóa cưỡng bức tài khoản ACB", "acb.account.forceDelete");
  }

  async lookupMbAccountHolderName(payload: AccountLookupRequestDto): Promise<SepayDetailResult<MbAccountLookupResponseDto["data"]>> {
    const response = await this.client.post<MbAccountLookupResponseDto["data"], AccountLookupRequestDto>(
      "/mb/individual/bankAccount/lookUpAccountHolderName",
      payload,
      this.req("tra cứu chủ tài khoản MB", "mb.account.lookup")
    );

    return { item: this.ensureData(response, "tra cứu chủ tài khoản MB") };
  }

  async createMbBankAccount(payload: BankAccountCreateRequestDto): Promise<MbBankAccountCreateResponseDto> {
    const response = await this.client.post<MbBankAccountCreateResponseDto, BankAccountCreateRequestDto>(
      "/mb/individual/bankAccount/create",
      payload,
      this.req("thêm tài khoản MB", "mb.account.create")
    );

    return this.ensureEnvelopeAs<MbBankAccountCreateResponseDto>(response, "thêm tài khoản MB");
  }

  async confirmMbBankAccount(requestId: string, payload: BankAccountConfirmRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, BankAccountConfirmRequestDto>(
      "/mb/individual/bankAccount/confirmApiConnection",
      payload,
      this.req("xác nhận liên kết MB", "mb.account.confirm", undefined, this.ensureRequestId(requestId))
    );

    return this.ensureOperation(response, "xác nhận liên kết MB");
  }

  async requestMbApiConnection(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/mb/individual/bankAccount/requestApiConnection/${bankAccountId}`, "yêu cầu liên kết MB", "mb.account.requestConnection");
  }

  async requestMbDelete(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/mb/individual/bankAccount/requestDelete/${bankAccountId}`, "yêu cầu xóa liên kết MB", "mb.account.requestDelete");
  }

  async confirmMbDelete(requestId: string, payload: OtpRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, OtpRequestDto>(
      "/mb/individual/bankAccount/confirmDelete",
      payload,
      this.req("xác nhận xóa liên kết MB", "mb.account.confirmDelete", undefined, this.ensureRequestId(requestId))
    );

    return this.ensureOperation(response, "xác nhận xóa liên kết MB");
  }

  async forceDeleteMbBankAccount(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/mb/individual/bankAccount/forceDelete/${bankAccountId}`, "xóa cưỡng bức tài khoản MB", "mb.account.forceDelete");
  }

  async lookupOcbAccountHolderName(payload: AccountLookupRequestDto): Promise<SepayDetailResult<{ account_holder_name: string }>> {
    const response = await this.client.post<{ account_holder_name: string }, AccountLookupRequestDto>(
      "/ocb/individual/bankAccount/lookUpAccountHolderName",
      payload,
      this.req("tra cứu chủ tài khoản OCB", "ocb.account.lookup")
    );

    return { item: this.ensureData(response, "tra cứu chủ tài khoản OCB") };
  }

  async createOcbBankAccount(payload: OcbBankAccountCreateRequestDto): Promise<OcbBankAccountCreateResponseDto> {
    const response = await this.client.post<OcbBankAccountCreateResponseDto, OcbBankAccountCreateRequestDto>(
      "/ocb/individual/bankAccount/create",
      payload,
      this.req("thêm tài khoản OCB", "ocb.account.create")
    );

    return this.ensureEnvelopeAs<OcbBankAccountCreateResponseDto>(response, "thêm tài khoản OCB");
  }

  async editOcbBankAccount(bankAccountId: string, payload: OcbEditBankAccountRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, OcbEditBankAccountRequestDto>(
      `/ocb/individual/bankAccount/edit/${bankAccountId}`,
      payload,
      this.req("cập nhật tài khoản OCB", "ocb.account.edit")
    );

    return this.ensureOperation(response, "cập nhật tài khoản OCB");
  }

  async requestCreateOcbVa(payload: CreateVARequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, CreateVARequestDto>(
      "/ocb/individual/VA/requestCreate",
      payload,
      this.req("yêu cầu tạo VA OCB", "ocb.va.requestCreate")
    );

    return this.ensureOperation(response, "yêu cầu tạo VA OCB");
  }

  async confirmCreateOcbVa(requestId: string, payload: OtpRequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, OtpRequestDto>(
      "/ocb/individual/VA/confirmCreate",
      payload,
      this.req("xác nhận tạo VA OCB", "ocb.va.confirmCreate", undefined, this.ensureRequestId(requestId))
    );

    return this.ensureOperation(response, "xác nhận tạo VA OCB");
  }

  async listOcbVa(query?: VaListQueryDto): Promise<SepayPaginatedResult<VirtualAccountDto>> {
    const response = await this.client.get<VirtualAccountDto[]>(
      "/ocb/individual/VA",
      this.req("danh sách VA OCB", "ocb.va.list", this.toParams(query))
    );

    return this.ensureList(response, "danh sách VA OCB");
  }

  async getOcbVaDetails(vaId: string): Promise<SepayDetailResult<VirtualAccountDto>> {
    const response = await this.client.get<VirtualAccountDto>(
      `/ocb/individual/VA/details/${vaId}`,
      this.req("chi tiết VA OCB", "ocb.va.details")
    );

    return { item: this.ensureData(response, "chi tiết VA OCB") };
  }

  async forceDeleteOcbBankAccount(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/ocb/individual/bankAccount/forceDelete/${bankAccountId}`, "xóa cưỡng bức tài khoản OCB", "ocb.account.forceDelete");
  }

  async lookupKlbAccountHolderName(payload: KlbAccountLookupRequestDto): Promise<SepayDetailResult<KlbAccountLookupResponseDto>> {
    const response = await this.client.post<KlbAccountLookupResponseDto, KlbAccountLookupRequestDto>(
      "/klb/bankAccount/lookUpAccountHolderName",
      payload,
      this.req("tra cứu chủ tài khoản KLB", "klb.account.lookup")
    );

    return { item: this.ensureData(response, "tra cứu chủ tài khoản KLB") };
  }

  async createKlbBankAccount(payload: KlbBankAccountCreateRequestDto): Promise<KlbBankAccountCreateResponseDto> {
    const response = await this.client.post<KlbBankAccountCreateResponseDto, KlbBankAccountCreateRequestDto>(
      "/klb/bankAccount/create",
      payload,
      this.req("thêm tài khoản KLB", "klb.account.create")
    );

    return this.ensureEnvelopeAs<KlbBankAccountCreateResponseDto>(response, "thêm tài khoản KLB");
  }

  async confirmKlbBankAccount(
    requestId: string,
    payload: KlbBankAccountConfirmRequestDto
  ): Promise<KlbBankAccountConfirmResponseDto> {
    const response = await this.client.post<KlbBankAccountConfirmResponseDto, KlbBankAccountConfirmRequestDto>(
      "/klb/bankAccount/confirmApiConnection",
      payload,
      this.req("xác nhận liên kết KLB", "klb.account.confirm", undefined, this.ensureRequestId(requestId))
    );

    return this.ensureEnvelopeAs<KlbBankAccountConfirmResponseDto>(response, "xác nhận liên kết KLB");
  }

  async requestKlbApiConnection(bankAccountId: string): Promise<KlbBankAccountRequestConnectionResponseDto> {
    const response = await this.client.post<KlbBankAccountRequestConnectionResponseDto, Record<string, never>>(
      `/klb/bankAccount/requestApiConnection/${bankAccountId}`,
      {},
      this.req("yêu cầu liên kết KLB", "klb.account.requestConnection")
    );

    return this.ensureEnvelopeAs<KlbBankAccountRequestConnectionResponseDto>(response, "yêu cầu liên kết KLB");
  }

  async forceDeleteKlbBankAccount(bankAccountId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/klb/bankAccount/forceDelete/${bankAccountId}`, "xóa cưỡng bức tài khoản KLB", "klb.account.forceDelete");
  }

  async createKlbVa(payload: CreateVARequestDto): Promise<SepayOperationResult> {
    const response = await this.client.post<never, CreateVARequestDto>(
      "/klb/VA/create",
      payload,
      this.req("tạo VA KLB", "klb.va.create")
    );

    return this.ensureOperation(response, "tạo VA KLB");
  }

  async enableKlbVa(vaId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/klb/VA/enable/${vaId}`, "kích hoạt lại VA KLB", "klb.va.enable");
  }

  async disableKlbVa(vaId: string): Promise<SepayOperationResult> {
    return this.requestOperation(`/klb/VA/disable/${vaId}`, "vô hiệu hóa VA KLB", "klb.va.disable");
  }

  async listKlbVa(query?: VaListQueryDto): Promise<SepayPaginatedResult<VirtualAccountDto>> {
    const response = await this.client.get<VirtualAccountDto[]>(
      "/klb/VA",
      this.req("danh sách VA KLB", "klb.va.list", this.toParams(query))
    );

    return this.ensureList(response, "danh sách VA KLB");
  }

  async getKlbVaDetails(vaId: string): Promise<SepayDetailResult<KlbVADetailsResponseDto["data"]>> {
    const response = await this.client.get<KlbVADetailsResponseDto["data"]>(
      `/klb/VA/details/${vaId}`,
      this.req("chi tiết VA KLB", "klb.va.details")
    );

    return { item: this.ensureData(response, "chi tiết VA KLB") };
  }

  async listBankAccounts(query?: BankAccountListQueryDto): Promise<SepayPaginatedResult<BankAccountDto>> {
    const response = await this.client.get<BankAccountDto[]>(
      "/bankAccount",
      this.req("danh sách tài khoản ngân hàng", "bankAccount.list", this.toParams(query))
    );

    return this.ensureList(response, "danh sách tài khoản ngân hàng");
  }

  async getBankAccountDetails(bankAccountId: string): Promise<SepayDetailResult<BankAccountDto>> {
    const response = await this.client.get<BankAccountDto>(
      `/bankAccount/details/${bankAccountId}`,
      this.req("chi tiết tài khoản ngân hàng", "bankAccount.details")
    );

    return { item: this.ensureData(response, "chi tiết tài khoản ngân hàng") };
  }

  async listTransactions(query?: TransactionListQueryDto): Promise<SepayPaginatedResult<TransactionHistoryDto>> {
    const response = await this.client.get<TransactionHistoryDto[]>(
      "/transaction",
      this.req("danh sách giao dịch", "transaction.list", this.toParams(query))
    );

    return this.ensureList(response, "danh sách giao dịch");
  }

  async getTransactionDetails(transactionId: string): Promise<SepayDetailResult<TransactionHistoryDto>> {
    const response = await this.client.get<TransactionHistoryDto>(
      `/transaction/details/${transactionId}`,
      this.req("chi tiết giao dịch", "transaction.details")
    );

    return { item: this.ensureData(response, "chi tiết giao dịch") };
  }

  private async requestOperation(
    path: string,
    operation: string,
    operationKey: RequestOptions["operationKey"]
  ): Promise<SepayOperationResult> {
    const response = await this.client.post<never, Record<string, never>>(path, {}, this.req(operation, operationKey));
    return this.ensureOperation(response, operation);
  }

  private ensureData<T>(response: SepayApiEnvelope<T>, operation: string): T {
    if (response.data === undefined || response.data === null) {
      throw new SepayHubError(`SePay Hub trả dữ liệu rỗng khi ${operation}`, {
        code: "UNEXPECTED_RESPONSE",
        operation,
        details: response
      });
    }

    return response.data;
  }

  private ensureList<T>(response: SepayApiEnvelope<T[]>, operation: string): SepayPaginatedResult<T> {
    const items = this.ensureData(response, operation);
    if (!Array.isArray(items)) {
      throw new SepayHubError(`SePay Hub trả dữ liệu danh sách không hợp lệ khi ${operation}`, {
        code: "UNEXPECTED_RESPONSE",
        operation,
        details: response
      });
    }

    if (!response.meta) {
      throw new SepayHubError(`SePay Hub thiếu metadata phân trang khi ${operation}`, {
        code: "UNEXPECTED_RESPONSE",
        operation,
        details: response
      });
    }

    return { items, meta: response.meta };
  }

  private ensureOperation(response: SepayApiEnvelope<unknown>, operation: string): SepayOperationResult {
    if (typeof response.code !== "number") {
      throw new SepayHubError(`SePay Hub trả thiếu code khi ${operation}`, {
        code: "UNEXPECTED_RESPONSE",
        operation,
        details: response
      });
    }

    const result: SepayOperationResult = {
      code: response.code,
      message: response.message ?? ""
    };

    if (typeof response.id === "string" && response.id.trim() !== "") {
      result.id = response.id;
    }

    const requestId = this.extractRequestId(response.data);
    if (requestId !== undefined) {
      result.request_id = requestId;
    }

    return result;
  }

  private ensureEnvelopeAs<T>(response: SepayApiEnvelope<unknown>, operation: string): T {
    if (typeof response.code !== "number") {
      throw new SepayHubError(`SePay Hub trả thiếu code khi ${operation}`, {
        code: "UNEXPECTED_RESPONSE",
        operation,
        details: response
      });
    }

    return response as unknown as T;
  }

  private ensureRequestId(requestId: string): string {
    const value = requestId.trim();
    if (!value) {
      throw new SepayHubError("Request-Id không được để trống", {
        code: "VALIDATION_ERROR"
      });
    }

    return value;
  }

  private extractRequestId(data: unknown): string | undefined {
    if (!data || typeof data !== "object") {
      return undefined;
    }

    const candidate = (data as { request_id?: unknown }).request_id;
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate;
    }

    return undefined;
  }

  private toParams<TQuery extends object>(
    query?: TQuery
  ): Record<string, string | number | boolean | undefined> | undefined {
    if (!query) {
      return undefined;
    }

    return query as Record<string, string | number | boolean | undefined>;
  }

  private req(
    operation: string,
    operationKey: RequestOptions["operationKey"],
    params?: RequestOptions["params"],
    requestId?: string
  ): RequestOptions {
    return {
      operation,
      operationKey,
      params,
      requestId
    };
  }
}
