# SDK Mapping (Docs v1.0.4 -> SDK)

Tài liệu này map endpoint trong `SePay Bank Hub API Documentation v1.0.4` sang method của SDK.

## Token

- `POST /token` -> `service.createAccessToken()`

## Danh mục chung

- `GET /bank` -> `service.getBanks()`
- `GET /merchant/counter` -> `service.getMerchantCounter(date?)`

## Company

- `POST /company/create` -> `service.company.create(payload)`
- `GET /company` -> `service.company.list(query?)`
- `POST /company/edit/:companyId` -> `service.company.update(companyId, payload)`
- `GET /company/details/:companyId` -> `service.company.details(companyId)`
- `GET /company/configuration/:companyId` -> `service.company.getConfig(companyId)`
- `POST /company/configuration/:companyId` -> `service.company.updateConfig(companyId, payload)`
- `GET /company/counter/:companyId` -> `service.company.counter(companyId, date?)`

## ACB

- `POST /acb/individual/bankAccount/create` -> `service.acb.createAccount(payload)`
- `POST /acb/individual/bankAccount/confirmApiConnection` -> `service.acb.confirmAccount(requestId, payload)`
- `POST /acb/individual/bankAccount/requestApiConnection/:bankAccountId` -> `service.acb.requestConnection(bankAccountId)`
- `POST /acb/individual/bankAccount/requestDelete/:bankAccountId` -> `service.acb.requestDelete(bankAccountId)`
- `POST /acb/individual/bankAccount/confirmDelete` -> `service.acb.confirmDelete(requestId, payload)`
- `POST /acb/individual/bankAccount/forceDelete/:bankAccountId` -> `service.acb.forceDelete(bankAccountId)`

## MB

- `POST /mb/individual/bankAccount/lookUpAccountHolderName` -> `service.mb.lookupAccountHolder(payload)`
- `POST /mb/individual/bankAccount/create` -> `service.mb.createAccount(payload)`
- `POST /mb/individual/bankAccount/confirmApiConnection` -> `service.mb.confirmAccount(requestId, payload)`
- `POST /mb/individual/bankAccount/requestApiConnection/:bankAccountId` -> `service.mb.requestConnection(bankAccountId)`
- `POST /mb/individual/bankAccount/requestDelete/:bankAccountId` -> `service.mb.requestDelete(bankAccountId)`
- `POST /mb/individual/bankAccount/confirmDelete` -> `service.mb.confirmDelete(requestId, payload)`
- `POST /mb/individual/bankAccount/forceDelete/:bankAccountId` -> `service.mb.forceDelete(bankAccountId)`

## OCB

- `POST /ocb/individual/bankAccount/lookUpAccountHolderName` -> `service.ocb.lookupAccountHolder(payload)`
- `POST /ocb/individual/bankAccount/create` -> `service.ocb.createAccount(payload)`
- `POST /ocb/individual/bankAccount/edit/:bankAccountId` -> `service.ocb.editAccount(bankAccountId, payload)`
- `POST /ocb/individual/VA/requestCreate` -> `service.ocb.requestCreateVa(payload)`
- `POST /ocb/individual/VA/confirmCreate` -> `service.ocb.confirmCreateVa(requestId, payload)`
- `GET /ocb/individual/VA` -> `service.ocb.listVa(query?)`
- `GET /ocb/individual/VA/details/:vaId` -> `service.ocb.getVaDetails(vaId)`
- `POST /ocb/individual/bankAccount/forceDelete/:bankAccountId` -> `service.ocb.forceDeleteAccount(bankAccountId)`

## KLB

- `POST /klb/bankAccount/lookUpAccountHolderName` -> `service.klb.lookupAccountHolder(payload)`
- `POST /klb/bankAccount/create` -> `service.klb.createAccount(payload)`
- `POST /klb/bankAccount/confirmApiConnection` -> `service.klb.confirmAccount(requestId, payload)`
- `POST /klb/bankAccount/requestApiConnection/:bankAccountId` -> `service.klb.requestConnection(bankAccountId)`
- `POST /klb/bankAccount/forceDelete/:bankAccountId` -> `service.klb.forceDeleteAccount(bankAccountId)`
- `POST /klb/VA/create` -> `service.klb.createVa(payload)`
- `POST /klb/VA/enable/:vaId` -> `service.klb.enableVa(vaId)`
- `POST /klb/VA/disable/:vaId` -> `service.klb.disableVa(vaId)`
- `GET /klb/VA` -> `service.klb.listVa(query?)`
- `GET /klb/VA/details/:vaId` -> `service.klb.getVaDetails(vaId)`

## Bank Account / Transaction

- `GET /bankAccount` -> `service.bankAccount.list(query?)`
- `GET /bankAccount/details/:bankAccountId` -> `service.bankAccount.details(bankAccountId)`
- `GET /transaction` -> `service.transaction.list(query?)`
- `GET /transaction/details/:transactionId` -> `service.transaction.details(transactionId)`

## Query DTO chuẩn hóa

- `CompanyListQueryDto`
- `BankAccountListQueryDto`
- `TransactionListQueryDto`
- `VaListQueryDto`

## Error policy áp dụng

Mỗi call đi kèm `operationKey`, sau đó SDK áp policy tại `src/error-policy.ts`:

- success set theo operation (`successCodes`)
- map business error theo `response.code`
- map `retryable` để consumer tự quyết định retry

