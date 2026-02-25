# 

# 

# 

# 

# 

## ![][image1]

# SePay Bank Hub API Documentation

## version 1.0.4

**Lịch sử thay đổi**

| Ngày | Nội dung | Version |
| :---- | :---- | :---- |
| 2025-01-23 | Hỗ trợ KienLongBank cá nhân/doanh nghiệp | 1.0.4 |
| 2025-01-14 | Hỗ trợ API xóa tài khoản chưa liên kết ngân hàng MB cá nhân | 1.0.3 |
| 2024-10-22 | Hỗ trợ ACB cá nhân | 1.0.2 |
| 2024-06-12 | Deprecated trường `id` của model lịch sử giao dịch | 1.0.1 |
| 2024-05-20 | Khởi tạo v1.0.0 | 1.0.0 |

**Mục lục**

[**1\. Tổng quan	4**](#1.-tổng-quan)

[**2\. API reference	6**](#2.-api-reference)

[Model schema	6](#model-schema)

[Model Ngân hàng	6](#model-ngân-hàng)

[Model Bộ đếm giao dịch	6](#model-bộ-đếm-giao-dịch)

[Model Công ty (tổ chức)	7](#model-công-ty-\(tổ-chức\))

[Model Cấu hình công ty (tổ chức)	7](#model-cấu-hình-công-ty-\(tổ-chức\))

[Model tài khoản ngân hàng	8](#model-tài-khoản-ngân-hàng)

[Model VA	8](#model-va)

[Model lịch sử giao dịch	9](#model-lịch-sử-giao-dịch)

[Quy trình tổng quát liên kết tài khoản ngân hàng	10](#quy-trình-tổng-quát-liên-kết-tài-khoản-ngân-hàng)

[Mã truy cập	11](#mã-truy-cập)

[API Tạo mã truy cập	11](#api-tạo-mã-truy-cập)

[Ngân hàng	11](#ngân-hàng)

[API Lấy danh sách ngân hàng	11](#api-lấy-danh-sách-ngân-hàng)

[Merchant	12](#merchant)

[API Truy vấn bộ đếm giao dịch	12](#api-truy-vấn-bộ-đếm-giao-dịch)

[Công ty (tổ chức)	12](#công-ty-\(tổ-chức\))

[API Tạo công ty (tổ chức)	13](#api-tạo-công-ty-\(tổ-chức\))

[API Truy vấn danh sách công ty (tổ chức)	13](#api-truy-vấn-danh-sách-công-ty-\(tổ-chức\))

[API Cập nhật công ty (tổ chức)	14](#api-cập-nhật-công-ty-\(tổ-chức\))

[API Truy vấn chi tiết công ty (tổ chức)	15](#api-truy-vấn-chi-tiết-công-ty-\(tổ-chức\))

[API Truy vấn cấu hình công ty (tổ chức)	15](#api-truy-vấn-cấu-hình-công-ty-\(tổ-chức\))

[API Cập nhật cấu hình công ty (tổ chức)	16](#api-cập-nhật-cấu-hình-công-ty-\(tổ-chức\))

[API Truy vấn bộ đếm công ty (tổ chức)	16](#api-truy-vấn-bộ-đếm-công-ty-\(tổ-chức\))

[Ngân hàng ACB dành cho cá nhân	17](#ngân-hàng-acb-dành-cho-cá-nhân)

[API Thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân	18](#api-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân)

[API Xác nhận thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân	20](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân)

[API Yêu cầu liên kết tài khoản ngân hàng ACB dành cho cá nhân	21](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-acb-dành-cho-cá-nhân)

[API Yêu cầu xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân	21](#api-yêu-cầu-xóa-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân)

[API Xác nhận xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân	22](#api-xác-nhận-xóa-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân)

[API Xóa tài khoản chưa liên kết API trước đó ngân hàng ACB dành cho cá nhân	23](#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-acb-dành-cho-cá-nhân)

[Ngân hàng MB dành cho cá nhân	24](#ngân-hàng-mb-dành-cho-cá-nhân)

[API Truy vấn tên chủ tài khoản ngân hàng MB	25](#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-mb)

[API Thêm tài khoản liên kết ngân hàng MB dành cho cá nhân	25](#api-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân)

[API Xác nhận thêm tài khoản liên kết ngân hàng MB dành cho cá nhân	27](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân)

[API Yêu cầu liên kết tài khoản ngân hàng MB dành cho cá nhân	28](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-mb-dành-cho-cá-nhân)

[API Yêu cầu xóa tài khoản liên kết ngân hàng MB dành cho cá nhân	28](#api-yêu-cầu-xóa-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân)

[API Xác nhận xóa tài khoản liên kết ngân hàng MB dành cho cá nhân	29](#api-xác-nhận-xóa-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân)

[API Xóa tài khoản chưa liên kết API trước đó ngân hàng MB dành cho cá nhân	30](#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-mb-dành-cho-cá-nhân)

[Ngân hàng OCB dành cho cá nhân	31](#ngân-hàng-ocb-dành-cho-cá-nhân)

[API Truy vấn tên chủ tài khoản ngân hàng OCB	32](#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-ocb)

[API Thêm tài khoản liên kết ngân hàng OCB dành cho cá nhân	32](#api-thêm-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân)

[API Cập nhật thông tin tài khoản ngân hàng OCB dành cho cá nhân (tạm thời)	34](#api-cập-nhật-thông-tin-tài-khoản-ngân-hàng-ocb-dành-cho-cá-nhân-\(tạm-thời\))

[API Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân	35](#api-yêu-cầu-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân)

[API Xác nhận tạo VA tài khoản liên kết ngân hàng OCB dành cho cá nhân	36](#api-xác-nhận-tạo-va-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân)

[API Truy vấn danh sách VA thuộc tài khoản ngân hàng OCB dành cho cá nhân	37](#api-truy-vấn-danh-sách-va-thuộc-tài-khoản-ngân-hàng-ocb-dành-cho-cá-nhân)

[API Truy vấn chi tiết VA thuộc tài khoản ngân hàng OCB dành cho cá nhân	38](#api-truy-vấn-chi-tiết-va-thuộc-tài-khoản-ngân-hàng-ocb-dành-cho-cá-nhân)

[API Xóa tài khoản chưa liên kết API trước đó ngân hàng OCB dành cho cá nhân	38](#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-ocb-dành-cho-cá-nhân)

[Ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	40](#ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Truy vấn tên chủ tài khoản ngân hàng KienLongBank	41](#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-kienlongbank)

[API Thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	42](#api-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Xác nhận thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	43](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Yêu cầu liên kết tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	44](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Xóa tài khoản chưa liên kết API trước đó ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	45](#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Tạo VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	45](#api-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Kích hoạt lại VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	46](#api-kích-hoạt-lại-va-cho-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Vô hiệu hóa VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	47](#api-vô-hiệu-hóa-va-cho-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Truy vấn danh sách VA thuộc tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	47](#api-truy-vấn-danh-sách-va-thuộc-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[API Truy vấn chi tiết VA thuộc tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp	48](#api-truy-vấn-chi-tiết-va-thuộc-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp)

[Tài khoản ngân hàng	48](#tài-khoản-ngân-hàng)

[API Truy vấn danh sách tài khoản ngân hàng	49](#api-truy-vấn-danh-sách-tài-khoản-ngân-hàng)

[API Truy vấn chi tiết tài khoản ngân hàng	49](#api-truy-vấn-chi-tiết-tài-khoản-ngân-hàng)

[Lịch sử giao dịch	50](#lịch-sử-giao-dịch)

[API Truy vấn lịch sử giao dịch	50](#api-truy-vấn-lịch-sử-giao-dịch)

[API Truy vấn chi tiết lịch sử giao dịch	51](#api-truy-vấn-chi-tiết-lịch-sử-giao-dịch)

[**3\. Đặc tả yêu cầu API nhận biến động số dư (IPN) cho Merchant	51**](#3.-đặc-tả-yêu-cầu-api-nhận-biến-động-số-dư-\(ipn\)-cho-merchant)

# 1\. Tổng quan {#1.-tổng-quan}

Tài liệu này cung cấp thông tin đặc tả về SePay Bank Hub API dành cho các đối tác muốn tích hợp dịch vụ API ngân hàng mà SePay đã ký kết hợp tác.

Đối với mỗi ngân hàng mà SePay đã ký kết hợp tác, phạm vi hỗ trợ tích hợp các tính năng thông qua API sẽ có những mức độ giới hạn khác nhau. Tất cả những giới hạn này đều từ    phía ngân hàng, không phải do SePay quy định. Chi tiết cụ thể ở bảng bên dưới:

| Ngân hàng |  |        MBBank |  OCB |  VietinBank |         ACB |  KienLong |
| :---- | :---- | ----- | ----- | :---- | ----- | ----- |
| Liên kết tài khoản | Cá nhân | Có \- Online qua OTP | Có \- Online qua OTP | (sắp ra mắt) | Có \- Online qua OTP | Có \- Online qua OTP |
|  | Doanh nghiệp | Có \- Online qua OTP | Có \- Hợp đồng (Sắp ra mắt) |  | Có \- Online qua OTP | Có \- Online qua OTP |
| Công nghệ tài khoản ảo (VA) | Hỗ trợ VA | Chưa | Có |  | Chưa | Có |
|  | Tạo VA | Chưa | Có |  | Chưa | Có |
|  | Vô hiệu hóa VA | Chưa | Không |  | Chưa | Có |
|  | Xóa VA | Không | Không |  | Chưa |  |
| Đồng bộ giao dịch | Đồng bộ giao dịch tiền vào qua VA | Chưa | Có |  | Chưa | Có |
|  | Đồng bộ giao dịch tiền ra | Có | Không |  | Có | Không |
|  | Đồng bộ số dư tại mỗi giao dịch | Chưa | Không |  | Không | Không |
|  | Đồng bộ chuyển khoản qua tài khoản chính | Có | Không |  | Có | Không |
|  | Tốc độ push notification sau khi thanh toán | \~ 2 giây | \~ 8 giây |  | \~ 1 giây | \~ 2 giây |

Có:                Có hỗ trợ  
Chưa:            Chưa hỗ trợ, sẽ hỗ trợ trong tương lai.  
Không:           Không hỗ trợ, và cũng không hỗ trợ trong tương lai.  
Hợp đồng:     Ký hợp đồng ba bên giữa khách hàng, SePay và ngân hàng.  
(Sắp ra mắt): Sẽ ra mắt trong tương lai

Toàn bộ API SePay Bank Hub sử dụng chung Base URL:  
[`https://partner-api.sepay.vn/merchant/v1`](https://partner-api.sepay.vn/merchant/v1)

Tất cả SePay Merchant API đều yêu cầu xác thực bằng mã truy cập thông qua Bearer Token. 

**Thông số Header chung cho SePay Merchant API (ngoại trừ API tạo mã truy cập)**

| Trường | Giá trị | Mô tả |
| :---- | :---- | :---- |
| Accept | application/json |  |
| Client-Message-Id | `<UUID>` |  |
| Authorization | Bearer `<YOUR_ACCESS_TOKEN>` |  |

**Bảng mã lỗi chung cho SePay Merchant API**

| 401 | Mã truy cập không hợp lệ hoặc hết hạn |
| :---- | :---- |
| 500 | Lỗi hệ thống SePay |

**Bảng quy tắc ràng buộc dữ liệu**

| `required` | Trường bắt buộc nhập |
| :---- | :---- |
| `string` | Trường phải có giá trị là kiểu chuỗi |
| `if_exist` | Nếu trường tồn tại thì các quy tắc phía sau nó sẽ được áp dụng |
| `max_length[x]` | Độ dài giá trị lớn nhất là x  |
| `min_length[x]` | Độ dài giá trị nhỏ nhất là x |
| `alpha` | Giá trị chỉ được chứa chữ cái |
| `less_than_equal_to[x]` | Giá trị chỉ được nhỏ hơn hoặc bằng x |
| `greater_than_equal_to[x]` | Giá trị chỉ được lớn hơn hoặc bằng x |
| `is_natural` | Giá trị phải là kiểu số tự nhiên |
| `in_list[x1,x2,...]` | Giá trị phải là một trong các phần tử trong tập hợp |
| `nullable` | Trường có thể null hoặc chứa giá trị rỗng |
| `regex_match[pattern]` | Trường phải có giá trị khớp với Regex pattern |
| `valid_email` | Trường phải có giá trị là địa chỉ email hợp lệ |

# 2\. API reference {#2.-api-reference}

## Model schema {#model-schema}

Tổng hợp các model có sử dụng trong tài liệu.

### Model Ngân hàng {#model-ngân-hàng}

| Thuộc tính | Mô tả | Kiểu dữ liệu |
| :---- | :---- | :---- |
| id | ID ngân hàng | string |
| brand\_name | Tên ngân hàng | string |
| full\_name | Tên đầy đủ ngân hàng | string |
| short\_name | Tên ngắn gọn ngân hàng | string |
| code | Mã ngân hàng  | string |
| bin | Bin ngân hàng | string |
| logo\_path | URL Logo ngân hàng | string |
| icon | URL Icon ngân hàng | string |
| active | Trạng thái ngân hàng được hỗ trợ bởi SePay | `”1”` | `”0”` |

### Model Bộ đếm giao dịch {#model-bộ-đếm-giao-dịch}

| Thuộc tính | Mô tả | Kiểu dữ liệu |
| :---- | :---- | :---- |
| company\_id | ID công ty (tổ chức) | string |
| date | Ngày phát sinh bộ đếm | Y-m-d |
| transaction | Tổng số lượng giao dịch trong ngày | string |
| transaction\_in | Tổng số lượng giao dịch tiền vào trong ngày | string |
| transaction\_out | Tổng số lượng giao dịch tiền ra trong ngày | string |

### Model Công ty (tổ chức) {#model-công-ty-(tổ-chức)}

| Thuộc tính | Mô tả | Kiểu dữ liệu |
| :---- | :---- | :---- |
| id | ID công ty (tổ chức) | string |
| full\_name | Tên đầy đủ | string |
| short\_name | Tên viết tắt | string |
| status | Trạng thái công ty (tổ chức) | `Pending`, `Active`, `Suspended`, `Terminated` , `Cancelled`, `Fraud` |
| created\_at | Ngày tạo | Y-m-d H:i:s |
| updated\_at | Lần cập nhật cuối | Y-m-d H:i:s |

### Model Cấu hình công ty (tổ chức) {#model-cấu-hình-công-ty-(tổ-chức)}

| Thuộc tính | Mô tả | Kiểu dữ liệu |
| :---- | :---- | :---- |
| payment\_code | Cấu hình nhận diện mã thanh toán | `”on”` | `”off”` |
| payment\_code\_prefix | Cấu hình tiền tố mã thanh toán | string |
| payment\_code\_suffix\_from | Cấu hình độ dài tối thiểu hậu tố mã thanh toán | number |
| payment\_code\_suffix\_to | Cấu hình độ dài tối đa hậu tố mã thanh toán  | number |
| payment\_code\_suffix\_character\_type | Cấu hình kiểu ký tự hậu tố mã thanh toán `NumberAndLetter`: Cho phép chữ cái và số `NumberOnly`: Chỉ cho phép chữ số  | `”NumberAndLetter”`, `”NumberOnly”` |
| transaction\_amount | Cấu hình số lượng giao dịch Số lượng giao dịch có thể là số nguyên dương không âm hoặc giá trị chuỗi `”Unlimited”` (không giới hạn) | number | `”Unlimited”` |

### Model tài khoản ngân hàng {#model-tài-khoản-ngân-hàng}

| Thuộc tính | Mô tả | Kiểu dữ liệu |
| :---- | :---- | :---- |
| id | ID tài khoản ngân hàng | string |
| company\_id | ID công ty (tổ chức) sở hữu tài khoản ngân hàng | string |
| bank\_id | ID ngân hàng | string |
| account\_holder\_name | Tên chủ tài khoản | string |
| account\_number | Số tài khoản | string |
| accumulated | Số dư | string |
| label | Tên gợi nhớ | string |
| bank\_api\_connected | Trạng thái đã liên kết API ngân hàng hay chưa | `”1”` | `”0”` |
| last\_transaction | Thời gian phát sinh giao dịch lần cuối | Y-m-d H:i:s |
| created\_at | Ngày tạo | Y-m-d H:i:s |
| updated\_at | Lần cập nhật cuối | Y-m-d H:i:s |

### Model VA {#model-va}

| Thuộc tính | Mô tả | Kiểu dữ liệu |
| :---- | :---- | :---- |
| id | ID tài khoản ngân hàng | string |
| company\_id | ID công ty (tổ chức) sở hữu tài khoản ngân hàng | string |
| bank\_account\_id | ID tài khoản ngân hàng sở hữu VA | string |
| va | Số VA | string |
| label | Tên gợi nhớ | string |
| active | Trạng thái hoạt động | `”1”` | `”0”` |
| created\_at | Ngày tạo | Y-m-d H:i:s |
| updated\_at | Lần cập nhật cuối | Y-m-d H:i:s |

### Model lịch sử giao dịch {#model-lịch-sử-giao-dịch}

| Thuộc tính | Mô tả | Kiểu dữ liệu |
| :---- | :---- | :---- |
| id (deprecated) | ID giao dịch | string |
| transaction\_id | ID giao dịch | string |
| transaction\_date | Thời gian nhận giao dịch | Y-m-d H:i:s |
| bank\_account\_id | ID tài khoản ngân hàng sở hữu giao dịch | string |
| account\_number | Số tài khoản ngân hàng | string |
| company\_id | ID công ty (tổ chức) sở hữu tài khoản ngân hàng | string |
| bank\_id | ID ngân hàng | string |
| va\_id | ID VA (nếu có) | string |
| va | Số VA | string |
| reference\_number | Mã tham chiếu FT | string |
| transaction\_content | Nội dung giao dịch | string |
| payment\_code | Mã thanh toán (nếu có) | string |
| transfer\_type | Loại giao dịch (credit: tiền vào, debit: tiền ra) | `”credit”` | `”debit”` |
| amount | Số tiền giao dịch | string |

## 

## Quy trình tổng quát liên kết tài khoản ngân hàng {#quy-trình-tổng-quát-liên-kết-tài-khoản-ngân-hàng}

Bên dưới là quy trình tham khảo tổng quát liên kết tài khoản ngân hàng từ phía hệ thống quý đối tác tới SePay BankHub.

## ![][image2]

***Lưu ý**: Quy trình trên chỉ mang tính chất tham khảo, tùy vào nghiệp vụ phía hệ thống quý đối tác có thể tùy chỉnh theo nhu cầu.*

## Mã truy cập {#mã-truy-cập}

Mã truy cập dùng để xác thực các SePay Merchant API.

### API Tạo mã truy cập {#api-tạo-mã-truy-cập}

Dùng để tạo mã truy cập thông qua cặp khóa Client ID, Client Secret được SePay cấp cho Merchant. Thời gian sống của mã truy cập là 60000 giây.

**POST** **/token/create**

**Auth Type**: Basic Auth

| Username | `<YOUR_CLIENT_ID>` |
| :---- | :---- |
| Password | `<YOUR_CLIENT_SECRET>` |

**Response**  
**{**  
   **"code": 201,**  
   **"message": "Resource created",**  
   **"data": {**  
       **"access\_token": "\<YOUR\_ACCESS\_TOKEN\>",**  
       **"ttl": 60000**  
   **}**  
**}**

**Bảng mã lỗi**

| 401 | Client ID hoặc Client Secret không chính xác |
| :---- | :---- |

## Ngân hàng {#ngân-hàng}

Bộ API dành chung cho tất cả ngân hàng SePay hỗ trợ.

### API Lấy danh sách ngân hàng {#api-lấy-danh-sách-ngân-hàng}

Liệt kê danh sách tất cả ngân hàng hiện SePay đang hỗ trợ cho Merchant.

**GET** **/bank**

**Response schema**  
**{**  
   **"data": *Array\<*[BankModel](#model-ngân-hàng)*\>***  
**}**

## Merchant {#merchant}

Bộ API quản lý Merchant.

### API Truy vấn bộ đếm giao dịch {#api-truy-vấn-bộ-đếm-giao-dịch}

Hiển thị thông tin bộ đếm giao dịch của Merchant.

**GET** **/merchant/counter**

**Query params**

| Trường | Kiểu dữ liệu | Mô tả |
| :---- | :---- | :---- |
| date | Y-m-d(ví dụ 2001-06-10) | Lọc theo ngày tháng năm |

**Response schema**  
**{**  
  **"data": {**  
      	 **"dates": *Array\<*[CounterModel](#model-bộ-đếm-giao-dịch)*\>*,**  
       **"total": {**  
          **"transaction": "number",**  
          **"transaction\_in": "number",**  
          **"transaction\_out": "number"**  
       **}**  
   **}**  
**}**

## Công ty (tổ chức) {#công-ty-(tổ-chức)}

Bộ API quản lý công ty (tổ chức) thuộc quyền quản lý của Merchant. Dù là khách hàng phía Merchant là cá nhân hay doanh nghiệp đều cần tạo một công ty (tổ chức) phía SePay để có thể theo dõi số lượng giao dịch, cấu hình…

### API Tạo công ty (tổ chức) {#api-tạo-công-ty-(tổ-chức)}

Tạo một công ty (tổ chức) thuộc quyền quản lý của Merchant.

**POST** **/company/create**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| full\_name | Tên đầy đủ công ty (tổ chức) | `required`, `string`, `max_length[200]` |
| short\_name | Tên viết tắt công ty (tổ chức) | `required`, `string`, `max_length[20]` |

**Response**  
**{**  
   **"code": 201,**  
   **"message": "Đã tạo công ty (tổ chức) thành công.",**  
   **"id": "\<CREATED\_COMPANY\_ID\>"**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 503 | Hệ thống chưa sẵn sàng |

### API Truy vấn danh sách công ty (tổ chức) {#api-truy-vấn-danh-sách-công-ty-(tổ-chức)}

Lấy danh sách các công ty (tổ chức) thuộc quyền quản lý của Merchant.

**GET** **/company**

**Query params**

| Trường | Kiểu dữ liệu | Mô tả |
| :---- | :---- | :---- |
| per\_page | string | Số bản ghi trên trang |
| q | string | Từ khóa tìm kiếm theo tên đầy đủ, tên viết tắt |
| status | `Pending`, `Active`, `Suspended`, `Terminated` , `Cancelled`, `Fraud` | Lọc theo trạng thái |
| sort\[created\_at\] | `asc` | `desc` | Sắp xếp theo ngày tạo |

**Response shema**  
**{**  
   **"data": *Array\<*[CompanyModel](#model-công-ty-\(tổ-chức\))*\>*,**  
   **"meta": {**  
       **"per\_page": "number",**  
       **"total": "number",**  
       **"has\_more": "boolean",**  
       **"current\_page": "number",**  
       **"page\_count": "number"**  
   **}**  
**}**

### API Cập nhật công ty (tổ chức) {#api-cập-nhật-công-ty-(tổ-chức)}

Cập nhật thông tin một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/company/edit/{companyId}**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| full\_name | Tên đầy đủ công ty (tổ chức) | `if_exist`, `required`, `string`, `max_length[200]` |
| short\_name | Tên viết tắt công ty (tổ chức) | `if_exist`, `required`, `string`, `max_length[20]` |
| status | Trạng thái công ty (tổ chức) | `if_exist`, `required,in:Pending`, `Active`, `Suspended`, `Terminated` , `Cancelled`, `Fraud` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã cập nhật thông tin công ty (tổ chức) thành công."**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |

### API Truy vấn chi tiết công ty (tổ chức) {#api-truy-vấn-chi-tiết-công-ty-(tổ-chức)}

Xem thông tin chi tiết một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**GET** **/company/details/{companyId}**  
**Response schema**  
**{**  
   **"data": [CompanyModel](#model-công-ty-\(tổ-chức\))**  
**}**

**Bảng mã lỗi**

| 404 | ID công ty (tổ chức) không tồn tại |
| :---- | :---- |

### API Truy vấn cấu hình công ty (tổ chức) {#api-truy-vấn-cấu-hình-công-ty-(tổ-chức)}

Xem thông tin cấu hình một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**GET** **/company/configuration/{companyId}**

**Response schema**  
**{**  
   **"data": [CompanyConfigurationModel](#model-cấu-hình-công-ty-\(tổ-chức\))**  
**}**

**Bảng mã lỗi**

| 404 | ID công ty (tổ chức) không tồn tại |
| :---- | :---- |

### API Cập nhật cấu hình công ty (tổ chức) {#api-cập-nhật-cấu-hình-công-ty-(tổ-chức)}

Cập nhật cấu hình một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/company/configuration/{companyId}**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| payment\_code | Cấu hình nhận diện mã thanh toán | `if_exist`, `in_list[on,off]` |
| payment\_code\_prefix | Cấu hình tiền tố mã thanh toán | `if_exist`, `alpha`, `min_length[2]`, `max_length[3]` |
| payment\_code\_suffix\_from | Cấu hình độ dài tối thiểu hậu tố mã thanh toán | `if_exist`, `is_natural`, `greater_than_equal_to[1]`,  `less_than_equal_to[30]` |
| payment\_code\_suffix\_to | Cấu hình độ dài tối đa hậu tố mã thanh toán  | `if_exist`, `is_natural`, `greater_than_equal_to[1]`,  `less_than_equal_to[30]` |
| payment\_code\_suffix\_character\_type | Cấu hình kiểu ký tự hậu tố mã thanh toán | `if_exist`, `in_list[NumberAndLetter,NumberOnly]` |
| transaction\_amount | Cấu hình số lượng giao dịch | `if_exist` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã cập nhật cấu hình công ty (tổ chức) thành công."**  
**}**

**Bảng mã lỗi**

| 404 | ID công ty (tổ chức) không tồn tại |
| :---- | :---- |

### API Truy vấn bộ đếm công ty (tổ chức) {#api-truy-vấn-bộ-đếm-công-ty-(tổ-chức)}

Hiển thị bộ đếm công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**GET** **/company/counter/{companyId}**

**Query params**

| Trường | Kiểu dữ liệu | Mô tả |
| :---- | :---- | :---- |
| date | Y-m-d(ví dụ 2001-06-10) | Lọc theo ngày tháng năm |

**Response schema**  
**{**  
  **"data": {**  
      **"dates": *Array\<*[CounterModel](#model-bộ-đếm-giao-dịch)*\>*,**  
       **"total": {**  
          **"transaction": "number",**  
          **"transaction\_in": "number",**  
          **"transaction\_out": "number"**  
       **}**  
   **}**  
**}**

## Ngân hàng ACB dành cho cá nhân {#ngân-hàng-acb-dành-cho-cá-nhân}

Bộ API quản lý tài khoản ngân hàng ACB dành cho cá nhân thuộc quyền quản lý của Merchant.

Bắt đầu, Merchant cần gọi [API Thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân) để thực hiện xác thực thông tin tài khoản ngân hàng ACB của người dùng, và lưu trên hệ thống SePay. Lúc này:

* SePay trả về `<REQUEST_ID>` (1), Merchant cần lưu lại giá trị này cho việc xác thực ở bước sau.  
* SePay trả về `<CREATED_BANK_ACCOUNT_ID>` là ID tài khoản ngân hàng vừa mới thêm, Merchant có thể lưu giá trị này lại phục vụ cho việc gửi lại yêu cầu liên kết.  
* Hệ thống ACB cùng lúc đó sẽ gửi OTP đến cho số điện thoại của người dùng (hoặc ACB ONE SafeKey).

Tại giao diện người dùng, Merchant yêu cầu họ cung cấp OTP đã nhận, sau đó phía Merchant gọi tiếp tục đến [API Xác nhận thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân) kèm với OTP và `<REQUEST_ID>` (1) và kết thúc luồng thực thi.  
Nếu cần yêu cầu gửi lại OTP, Merchant có thể gọi [API Yêu cầu liên kết tài khoản ngân hàng ACB dành cho cá nhân](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-acb-dành-cho-cá-nhân), SePay sẽ trả về `<REQUEST_ID>` (2), Merchant cần lưu lại giá trị này cho việc xác thực lại tại [API Xác nhận thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân).

### API Thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân {#api-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân}

Thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/acb/individual/bankAccount/create**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| company\_id | ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản sắp tạo | `required`, `string` |
| account\_holder\_name | Tên chủ tài khoản ngân hàng ACB dành cho cá nhân | `required`, `string` |
| account\_number | Số tài khoản ngân hàng ACB cần liên kết | `required`, `string`, `max_length[20]` |
| phone\_number | Số điện thoại đã dùng để đăng ký tài khoản ngân hàng ACB | `required`, `string`, `max_length[20]` |
| label | Tên gợi nhớ | `nullable`, `max_length[100]` |

**Response `2011`:** Thêm tài khoản liên kết ngân hàng ACB thành công với trạng thái tài khoản ngân hàng ACB hiện chưa được liên kết API với SePay trên hệ thống ngân hàng.  
**{**  
   **"code": 2011,**  
   **"message": "Đã thêm tài khoản ngân hàng và gửi OTP xác thực liên kết API.",**  
   **"id": "\<CREATED\_BANK\_ACCOUNT\_ID\>",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**  
Giá trị `<REQUEST_ID>` sẽ được dùng để xác thực cho [API xác nhận thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân). Đồng thời lúc này, hệ thống ngân hàng ACB cũng gửi OTP đến số điện thoại đã dùng để đăng ký tài khoản ngân hàng ACB.

**Response `2012`:** Thêm tài khoản liên kết ngân hàng ACB thành công với trạng thái tài khoản ngân hàng ACB đang được liên kết API với SePay trên hệ thống ngân hàng.  
**{**  
   **"code": 2012,**  
   **"message": "Đã liên kết API tài khoản ngân hàng thành công.",**  
   **"id": "\<CREATED\_BANK\_ACCOUNT\_ID\>"**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số tài khoản đã tồn tại trên hệ thống SePay |
| 4004 | Số tài khoản không tồn tại hoặc đã bị khóa trên hệ thống ngân hàng ACB |
| 4005 | Số tài khoản này không thuộc nhóm khách hàng cá nhân |
| 4006 | Số điện thoại không được đăng ký cho tài khoản ngân hàng ACB |
| 4007 | Yêu cầu quá nhiều lần, vui lòng thử lại sau 2 phút |
| 504 | Hệ thống ACB đang bận |

### API Xác nhận thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân {#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân}

Xác nhận thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/acb/individual/bankAccount/confirmApiConnection**

**Headers**

| Trường | Giá trị | Mô tả |
| :---- | :---- | :---- |
| Request-Id | `<REQUEST_ID>` | Giá trị được trả về ở response `2011` của [API thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân) hoặc được trả về ở response của [API yêu cầu liên kết tài khoản ngân hàng ACB dành cho cá nhân](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-acb-dành-cho-cá-nhân) |

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| otp | Mã OTP được gửi tới số điện thoại đã dùng để đăng ký tài khoản ngân hàng ACB (hoặc ACB ONE SafeKey) | `required`, `string`, `regex_match[/^[0-9]+$/]` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã liên kết API tài khoản ngân hàng thành công.",**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | OTP không chính xác hoặc đã hết hiệu lực |
| 504 | Hệ thống ACB đang bận |

### API Yêu cầu liên kết tài khoản ngân hàng ACB dành cho cá nhân {#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-acb-dành-cho-cá-nhân}

Gửi yêu cầu liên kết tài khoản ngân hàng ACB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant. API này hữu ích cho việc gửi lại mã OTP và tạo `<REQUEST_ID>` cho [API xác nhận thêm tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân).

**POST** **/acb/individual/bankAccount/requestApiConnection/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gửi OTP xác thực liên kết API.",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

**Bảng mã lỗi**

| 409 | Tài khoản ngân hàng đã được liên kết API trước đó |
| :---- | :---- |
| 4007 | Yêu cầu quá nhiều lần, vui lòng thử lại sau 2 phút |
| 504 | Hệ thống ACB đang bận |

### API Yêu cầu xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân {#api-yêu-cầu-xóa-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân}

Yêu cầu xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân của một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/acb/individual/bankAccount/requestDelete/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gửi OTP hủy liên kết API.",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

Giá trị `<REQUEST_ID>` sẽ được dùng để xác thực cho [API xác nhận xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-xác-nhận-xóa-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân). Đồng thời lúc này, hệ thống ngân hàng ACB cũng gửi OTP đến số điện thoại đã dùng để đăng ký tài khoản ngân hàng ACB (hoặc ACB ONE SafeKey).

**Bảng mã lỗi**

| 409 | Tài khoản ngân hàng chưa được liên kết API trước đó |
| :---- | :---- |
| 4007 | Yêu cầu quá nhiều lần, vui lòng thử lại sau 2 phút |
| 504 | Hệ thống ACB đang bận |

### API Xác nhận xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân {#api-xác-nhận-xóa-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân}

Xác nhận xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân của một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant. SePay cũng sẽ hủy liên kết API với tài khoản ngân hàng trên hệ thống của ACB.

**POST** **/acb/individual/bankAccount/confirmDelete**

**Headers**

| Trường | Giá trị | Mô tả |
| :---- | :---- | :---- |
| Request-Id | `<REQUEST_ID>` | Giá trị được trả về ở response `200` của [API Yêu cầu xóa tài khoản liên kết ngân hàng ACB dành cho cá nhân](#api-yêu-cầu-xóa-tài-khoản-liên-kết-ngân-hàng-acb-dành-cho-cá-nhân) |

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| otp | Mã OTP được gửi tới số điện thoại đã dùng để đăng ký tài khoản ngân hàng ACB (hoặc ACB ONE SafeKey) | `required`, `string`, `regex_match[/^[0-9]+$/]` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã hủy liên kết API thành công.",**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | OTP không chính xác hoặc đã hết hiệu lực |
| 504 | Hệ thống ACB đang bận |

### API Xóa tài khoản chưa liên kết API trước đó ngân hàng ACB dành cho cá nhân {#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-acb-dành-cho-cá-nhân}

Trong các trường hợp tài khoản ngân hàng chưa được liên kết OTP trước đó, quý đối tác có thể sử dụng API này để xóa tài khoản ngân hàng này trên hệ thống SePay BankHub không cần xác thực OTP.

**POST** **/acb/individual/bankAccount/forceDelete/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gỡ tài khoản ngân hàng thành công."**  
**}**

**Bảng mã lỗi**

| 400 | Tài khoản ngân hàng này đang liên kết API, vui lòng hủy liên kết theo luồng OTP. |
| :---- | :---- |

## 

## 

## Ngân hàng MB dành cho cá nhân {#ngân-hàng-mb-dành-cho-cá-nhân}

Bộ API quản lý tài khoản ngân hàng MB dành cho cá nhân thuộc quyền quản lý của Merchant.

Bắt đầu, Merchant cần gọi [API Thêm tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân) để thực hiện xác thực thông tin tài khoản ngân hàng MB của người dùng, và lưu trên hệ thống SePay. Lúc này:

* SePay trả về `<REQUEST_ID>` (1), Merchant cần lưu lại giá trị này cho việc xác thực ở bước sau.  
* SePay trả về `<CREATED_BANK_ACCOUNT_ID>` là ID tài khoản ngân hàng vừa mới thêm, Merchant có thể lưu giá trị này lại phục vụ cho việc gửi lại yêu cầu liên kết.  
* Hệ thống MB cùng lúc đó sẽ gửi OTP đến cho số điện thoại của người dùng.

Tại giao diện người dùng, Merchant yêu cầu họ cung cấp OTP đã nhận, sau đó phía Merchant gọi tiếp tục đến [API Xác nhận thêm tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân) kèm với OTP và `<REQUEST_ID>` (1) và kết thúc luồng thực thi.  
Nếu cần yêu cầu gửi lại OTP, Merchant có thể gọi [API Yêu cầu liên kết tài khoản ngân hàng MB dành cho cá nhân](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-mb-dành-cho-cá-nhân), SePay sẽ trả về `<REQUEST_ID>` (2), Merchant cần lưu lại giá trị này cho việc xác thực lại tại [API Xác nhận thêm tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân).

### API Truy vấn tên chủ tài khoản ngân hàng MB {#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-mb}

Truy vấn tên chủ tài khoản từ số tài khoản ngân hàng MB.

**POST** **/mb/individual/bankAccount/lookUpAccountHolderName**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| account\_number | Số tài khoản ngân hàng MB | `required`, `string`, `max_length[20]` |

**Response**  
**{**  
   **"code": 200,**  
   **"data": {**  
       **"account\_holder\_name": "string"**  
   **}**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số tài khoản không tồn tại trên hệ thống ngân hàng MB |
| 504 | Hệ thống MB đang bận |

### API Thêm tài khoản liên kết ngân hàng MB dành cho cá nhân {#api-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân}

Thêm tài khoản liên kết ngân hàng MB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/mb/individual/bankAccount/create**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| company\_id | ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản sắp tạo | `required`, `string` |
| account\_holder\_name | Tên chủ tài khoản ngân hàng MB dành cho cá nhân Giá trị này lấy từ [API Truy vấn tên chủ tài khoản ngân hàng MB](#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-mb) | `required`, `string` |
| account\_number | Số tài khoản ngân hàng MB cần liên kết | `required`, `string`, `max_length[20]` |
| identification\_number | Số CMND/CCCD đã dùng để đăng ký tài khoản ngân hàng MB | `required`, `string`, `max_length[100]` |
| phone\_number | Số điện thoại đã dùng để đăng ký tài khoản ngân hàng MB | `required`, `string`, `max_length[20]` |
| label | Tên gợi nhớ | `nullable`, `max_length[100]` |

**Response `2011`:** Thêm tài khoản liên kết ngân hàng MB thành công với trạng thái tài khoản ngân hàng MB hiện chưa được liên kết API với SePay trên hệ thống ngân hàng.  
**{**  
   **"code": 2011,**  
   **"message": "Đã thêm tài khoản ngân hàng và gửi OTP xác thực liên kết API.",**  
   **"id": "\<CREATED\_BANK\_ACCOUNT\_ID\>",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

Giá trị `<REQUEST_ID>` sẽ được dùng để xác thực cho [API xác thực thêm tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân). Đồng thời lúc này, hệ thống ngân hàng MB cũng gửi OTP đến số điện thoại đã dùng để đăng ký tài khoản ngân hàng MB.

**Response `2012`:** Thêm tài khoản liên kết ngân hàng MB thành công với trạng thái tài khoản ngân hàng MB đang được liên kết API với SePay trên hệ thống ngân hàng.  
**{**  
   **"code": 2011,**  
   **"message": "Đã liên kết API tài khoản ngân hàng thành công.",**  
   **"id": "\<CREATED\_BANK\_ACCOUNT\_ID\>"**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số tài khoản đã tồn tại trên hệ thống SePay |
| 4002 | Số CCCD/CMND và số điện thoại không được đăng ký cho tài khoản ngân hàng |
| 4003 | Số CCCD/CMND không được đăng ký cho tài khoản ngân hàng |
| 4004 | Số tài khoản không tồn tại trên hệ thống ngân hàng MB |
| 4005 | Tên chủ tài khoản không khớp thông tin với tài khoản ngân hàng MB |
| 4006 | Số điện thoại không được đăng ký cho tài khoản ngân hàng MB |
| 504 | Hệ thống MB đang bận |

### API Xác nhận thêm tài khoản liên kết ngân hàng MB dành cho cá nhân {#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân}

Xác nhận thêm tài khoản liên kết ngân hàng MB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/mb/individual/bankAccount/confirmApiConnection**

**Headers**

| Trường | Giá trị | Mô tả |
| :---- | :---- | :---- |
| Request-Id | `<REQUEST_ID>` | Giá trị được trả về ở response `2011` của [API thêm tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân) hoặc được trả về ở response của [API yêu cầu liên kết tài khoản ngân hàng MB dành cho cá nhân](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-mb-dành-cho-cá-nhân) |

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| otp | Mã OTP được gửi tới số điện thoại đã dùng để đăng ký tài khoản ngân hàng MB | `required`, `string`, `regex_match[/^[0-9]{8}$/]` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã liên kết API tài khoản ngân hàng MB thành công.",**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | OTP không chính xác hoặc đã hết hiệu lực |
| 504 | Hệ thống MB đang bận |

### API Yêu cầu liên kết tài khoản ngân hàng MB dành cho cá nhân {#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-mb-dành-cho-cá-nhân}

Gửi yêu cầu liên kết tài khoản ngân hàng MB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant. API này hữu ích cho việc gửi lại mã OTP và tạo `<REQUEST_ID>` cho [API xác thực thêm tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân).

**POST** **/mb/individual/bankAccount/requestApiConnection/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gửi OTP xác thực liên kết API.",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

**Bảng mã lỗi**

| 409 | Tài khoản ngân hàng đã được liên kết API trước đó |
| :---- | :---- |
| 504 | Hệ thống MB đang bận |

### API Yêu cầu xóa tài khoản liên kết ngân hàng MB dành cho cá nhân {#api-yêu-cầu-xóa-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân}

Yêu cầu xóa tài khoản liên kết ngân hàng MB dành cho cá nhân của một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/mb/individual/bankAccount/requestDelete/{bankAccountId}**  
**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gửi OTP hủy liên kết API.",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

Giá trị `<REQUEST_ID>` sẽ được dùng để xác thực cho [API xác thực xóa tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-xác-nhận-xóa-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân). Đồng thời lúc này, hệ thống ngân hàng MB cũng gửi OTP đến số điện thoại đã dùng để đăng ký tài khoản ngân hàng MB.

**Bảng mã lỗi**

| 409 | Tài khoản ngân hàng chưa được liên kết API trước đó |
| :---- | :---- |
| 504 | Hệ thống MB đang bận |

### API Xác nhận xóa tài khoản liên kết ngân hàng MB dành cho cá nhân {#api-xác-nhận-xóa-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân}

Xác nhận xóa tài khoản liên kết ngân hàng MB dành cho cá nhân của một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant. SePay cũng sẽ hủy liên kết API với tài khoản ngân hàng trên hệ thống của MB.

**POST** **/mb/individual/bankAccount/confirmDelete**

**Headers**

| Trường | Giá trị | Mô tả |
| :---- | :---- | :---- |
| Request-Id | `<REQUEST_ID>` | Giá trị được trả về ở response `200` của [API Yêu cầu xóa tài khoản liên kết ngân hàng MB dành cho cá nhân](#api-yêu-cầu-xóa-tài-khoản-liên-kết-ngân-hàng-mb-dành-cho-cá-nhân) |

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| otp | Mã OTP được gửi tới số điện thoại đã dùng để đăng ký tài khoản ngân hàng MB | `required`, `string`, `regex_match[/^[0-9]{8}$/]` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã hủy liên kết API thành công.",**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | OTP không chính xác hoặc đã hết hiệu lực |
| 504 | Hệ thống MB đang bận |

### API Xóa tài khoản chưa liên kết API trước đó ngân hàng MB dành cho cá nhân {#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-mb-dành-cho-cá-nhân}

Trong các trường hợp tài khoản ngân hàng chưa được liên kết OTP trước đó, quý đối tác có thể sử dụng API này để xóa tài khoản ngân hàng này trên hệ thống SePay BankHub không cần xác thực OTP.

**POST** **/mb/individual/bankAccount/forceDelete/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gỡ tài khoản ngân hàng thành công."**  
**}**

**Bảng mã lỗi**

| 400 | Tài khoản ngân hàng này đang liên kết API, vui lòng hủy liên kết theo luồng OTP. |
| :---- | :---- |

## 

## Ngân hàng OCB dành cho cá nhân {#ngân-hàng-ocb-dành-cho-cá-nhân}

Bộ API quản lý tài khoản ngân hàng OCB dành cho cá nhân thuộc quyền quản lý của Merchant.

Bắt đầu, Merchant cần gọi [API Thêm tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-thêm-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân) để thực hiện xác thực thông tin tài khoản ngân hàng OCB của người dùng, và lưu trên hệ thống SePay với trạng thái **chưa liên kết API**. SePay trả về `<CREATED_BANK_ACCOUNT_ID>` là ID tài khoản ngân hàng vừa mới thêm. Merchant lưu giá trị này lại phục vụ cho việc yêu cầu tạo VA ở bước tiếp theo.  
Tiếp đến, để có thể bật trạng thái liên kết API, SePay yêu cầu phải tạo VA đầu tiên trên tài khoản ngân hàng OCB. Vì vậy, Merchant cần thực hiện gọi [API Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-yêu-cầu-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân). Lúc này:

* SePay trả về `<REQUEST_ID>`, Merchant cần lưu lại giá trị này cho việc xác thực ở bước sau.  
* Hệ thống OCB cùng lúc đó sẽ gửi OTP đến cho số điện thoại của người dùng.

Tại giao diện người dùng, Merchant yêu cầu họ cung cấp OTP đã nhận, sau đó phía Merchant gọi tiếp tục đến [API Xác nhận tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-xác-nhận-tạo-va-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân) kèm với OTP và `<REQUEST_ID>`, nếu thành công, SePay sẽ tạo VA và bật trạng thái **đã liên kết API** và kết thúc luồng thực thi.  
Nếu cần yêu cầu gửi lại OTP, Merchant có thể gọi lại [API Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-yêu-cầu-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân) với thông tin trước đó.

### API Truy vấn tên chủ tài khoản ngân hàng OCB {#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-ocb}

Truy vấn tên chủ tài khoản từ số tài khoản ngân hàng OCB.

**POST** **/ocb/individual/bankAccount/lookUpAccountHolderName**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| account\_number | Số tài khoản ngân hàng OCB | `required`, `string`, `max_length[20]` |

**Response**  
**{**  
   **"code": 200,**  
   **"data": {**  
       **"account\_holder\_name": "string"**  
   **}**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số tài khoản không tồn tại trên hệ thống ngân hàng OCB |
| 504 | Hệ thống OCB đang bận |

### API Thêm tài khoản liên kết ngân hàng OCB dành cho cá nhân {#api-thêm-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân}

Thêm tài khoản liên kết ngân hàng OCB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant. SePay nhận diện tài khoản ngân hàng OCB đã được liên kết API hay chưa thông qua tạo VA bằng [API Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-yêu-cầu-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân).

**POST** **/ocb/individual/bankAccount/create**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| company\_id | ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản sắp tạo | `required`, `string` |
| account\_holder\_name | Tên chủ tài khoản ngân hàng MB dành cho cá nhân Giá trị này lấy từ [API Truy vấn tên chủ tài khoản ngân hàng OCB](#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-ocb) | `required`, `string` |
| account\_number | Số tài khoản ngân hàng MB cần liên kết | `required`, `string`, `max_length[20]` |
| identification\_number | Số CMND/CCCD đã dùng để đăng ký tài khoản ngân hàng OCB | `required`, `string`, `max_length[100]` |
| phone\_number | Số điện thoại đã dùng để đăng ký tài khoản ngân hàng OCB | `required`, `string`, `max_length[20]` |
| label | Tên gợi nhớ | `nullable`, `max_length[100]` |

**Response**  
**{**  
   **"code": 201,**  
   **"message": "Đã thêm tài khoản ngân hàng thành công.",**  
   **"id": "\<CREATED\_BANK\_ACCOUNT\_ID\>"**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số tài khoản đã tồn tại trên hệ thống SePay |
| 4002 | Số CCCD/CMND không được đăng ký cho tài khoản ngân hàng OCB |
| 4003 | Số điện thoại không được đăng ký cho tài khoản ngân hàng OCB |
| 4004 | Số tài khoản không tồn tại trên hệ thống ngân hàng OCB |
| 504 | Hệ thống OCB đang bận |

### API Cập nhật thông tin tài khoản ngân hàng OCB dành cho cá nhân (tạm thời) {#api-cập-nhật-thông-tin-tài-khoản-ngân-hàng-ocb-dành-cho-cá-nhân-(tạm-thời)}

Cho phép cập nhật thông tin số điện thoại và số CCCD/CMND đã đăng ký cho tài khoản ngân hàng OCB dành cho cá nhân thuộc quyền quản lý của Merchant. API này giúp giải quyết vấn đề lỗi sai thông tin số điện thoại và số CCCD/CMND khi thực hiện [API Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-yêu-cầu-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân). API này chỉ có hiệu lực **tạm thời** tại thời điểm xuất hiện trên tài liệu này.

**POST** **/ocb/individual/bankAccount/edit/{bankAccountId}**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| identification\_number | Số CMND/CCCD đã dùng để đăng ký tài khoản ngân hàng OCB | `if_exist,required`, `string`, `max_length[100]` |
| phone\_number | Số điện thoại đã dùng để đăng ký tài khoản ngân hàng OCB | `if_exist,required`, `string`, `max_length[20]` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã cập nhật tài khoản ngân hàng thành công."**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |

### API Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân {#api-yêu-cầu-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân}

Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân thuộc quyền quản lý của Merchant. SePay nhận diện tài khoản ngân hàng OCB đã được liên kết API hay chưa thông qua tạo VA đầu tiên cho tài khoản ngân hàng trên hệ thống của SePay sau khi thực hiện [API Xác nhận tạo VA tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-xác-nhận-tạo-va-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân).

Tất cả VA của ngân hàng OCB dành cho cá nhân được tạo từ hệ thống SePay đều bắt đầu bằng tiền tố `SEP`.

**POST** **/ocb/individual/VA/requestCreate**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| bank\_account\_id | ID tài khoản ngân hàng OCB thuộc quyền quản lý của Merchant sở hữu VA sắp tạo | `required`, `string` |
| company\_id | ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản ngân hàng | `required`, `string` |
| merchant\_name | Tên điểm bán | `required`, `string`, `min_length[1]`, `max_length[500`\], `regex_match[/^[a-zA-Z0-9\s\-]+$/]` |
| email | Địa chỉ e-mail cho chủ tài khoản OCB cá nhân | `required`, `valid_email` |
| merchant\_address | Địa chỉ điểm bán | `required`, `string`, `min_length[1]`, `max_length[1000`\], `regex_match[/^[a-zA-Z0-9\s\-]+$/]` |
| va | Số VA (không bao gồm tiền tố `SEP`) | `required`, `string`,  `min_length[1]`, `max_length[15]`, `regex_match[/^[A-Z0-9]+$/]`  |
| label | Tên gợi nhớ | `nullable`, `max_length[100]` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gửi OTP xác thực tạo VA thành công.",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

Giá trị `<REQUEST_ID>` sẽ được dùng để xác thực cho API tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân. Đồng thời lúc này, hệ thống ngân hàng OCB cũng gửi OTP đến số điện thoại đã dùng để đăng ký tài khoản ngân hàng OCB.

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số VA đã được sử dụng |
| 504 | Hệ thống OCB đang bận |

### API Xác nhận tạo VA tài khoản liên kết ngân hàng OCB dành cho cá nhân {#api-xác-nhận-tạo-va-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân}

Xác nhận tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/ocb/individual/VA/confirmCreate**

**Headers**

| Trường | Giá trị | Mô tả |
| :---- | :---- | :---- |
| Request-Id | `<REQUEST_ID>` | Giá trị được trả về ở response của [API Yêu cầu tạo VA cho tài khoản liên kết ngân hàng OCB dành cho cá nhân](#api-yêu-cầu-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-ocb-dành-cho-cá-nhân) |

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| otp | Mã OTP được gửi tới số điện thoại đã dùng để đăng ký tài khoản ngân hàng OCB | `required`, `string`, `regex_match[/^[0-9]{6}$/]` |

**Response**  
**{**  
   **"code": 201,**  
   **"message": "Đã tạo VA thành công.",**  
   **"id": "\<CREATED\_VA\_ID\>"**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | OTP không chính xác |
| 4002 | OTP đã hết hiệu lực |
| 504 | Hệ thống OCB đang bận |

### API Truy vấn danh sách VA thuộc tài khoản ngân hàng OCB dành cho cá nhân {#api-truy-vấn-danh-sách-va-thuộc-tài-khoản-ngân-hàng-ocb-dành-cho-cá-nhân}

Lấy danh sách VA của tài khoản ngân hàng OCB thuộc quyền quản lý của Merchant.

**GET** **/ocb/individual/VA**

**Query params**

| Trường | Kiểu dữ liệu | Mô tả |
| :---- | :---- | :---- |
| per\_page | string | Số bản ghi trên trang |
| q | string | Từ khóa tìm kiếm theo số VA và tên gợi nhớ |
| company\_id | string | Lọc theo ID công ty (tổ chức) sở hữu VA |
| bank\_account\_id | string | Lọc theo tài khoản ngân hàng OCB sở hữu VA |

**Response shema**  
**{**  
   **"data": *Array\<*[VAModel](#model-va)*\>*,**  
   **"meta": {**  
       **"per\_page": "number",**  
       **"total": "number",**  
       **"has\_more": "boolean",**  
       **"current\_page": "number",**  
       **"page\_count": "number"**  
   **}**  
**}**

### API Truy vấn chi tiết VA thuộc tài khoản ngân hàng OCB dành cho cá nhân {#api-truy-vấn-chi-tiết-va-thuộc-tài-khoản-ngân-hàng-ocb-dành-cho-cá-nhân}

Xem thông tin chi tiết một VA bất kỳ thuộc thuộc tài khoản ngân hàng OCB dành cho cá nhân thuộc quyền quản lý của Merchant.

**GET** **/ocb/individual/VA/details/{vaId}**

**Response schema**  
**{**  
   **"data": [VAModel](#model-va)**  
**}**

### API Xóa tài khoản chưa liên kết API trước đó ngân hàng OCB dành cho cá nhân {#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-ocb-dành-cho-cá-nhân}

Trong các trường hợp tài khoản ngân hàng chưa được liên kết OTP trước đó, quý đối tác có thể sử dụng API này để xóa tài khoản ngân hàng này trên hệ thống SePay BankHub không cần xác thực OTP.

**POST** **/ocb/individual/bankAccount/forceDelete/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gỡ tài khoản ngân hàng thành công."**  
**}**

**Bảng mã lỗi**

| 400 | Tài khoản ngân hàng này đang liên kết API, vui lòng hủy liên kết theo luồng OTP. |
| :---- | :---- |

## 

## Ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Bộ API quản lý tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp thuộc quyền quản lý của Merchant.

Bắt đầu, Merchant cần gọi [API Thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp) để thực hiện xác thực thông tin tài khoản ngân hàng KienLongBank của người dùng, và lưu trên hệ thống SePay. Lúc này:

* SePay trả về `<REQUEST_ID>` (1), Merchant cần lưu lại giá trị này cho việc xác thực ở bước sau.  
* SePay trả về `<CREATED_BANK_ACCOUNT_ID>` là ID tài khoản ngân hàng vừa mới thêm, Merchant có thể lưu giá trị này lại phục vụ cho việc gửi lại yêu cầu liên kết.  
* Hệ thống MB cùng lúc đó sẽ gửi OTP đến cho số điện thoại của người dùng.

Tại giao diện người dùng, Merchant yêu cầu họ cung cấp OTP đã nhận, sau đó phía Merchant gọi tiếp tục đến [API Xác nhận thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp) kèm với OTP và `<REQUEST_ID>` (1) và kết thúc luồng thực thi.  
Nếu cần yêu cầu gửi lại OTP, Merchant có thể gọi [API Yêu cầu liên kết tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp), SePay sẽ trả về `<REQUEST_ID>` (2), Merchant cần lưu lại giá trị này cho việc xác thực lại tại [API Xác nhận thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp).  
Để có thể chia sẻ giao dịch tiền vào, Merchant cần yêu cầu người dùng tạo tài khoản ảo (VA) đầu tiên để có thể bắt đầu thông qua [API Tạo VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp).

### API Truy vấn tên chủ tài khoản ngân hàng KienLongBank {#api-truy-vấn-tên-chủ-tài-khoản-ngân-hàng-kienlongbank}

Truy vấn tên chủ tài khoản từ số tài khoản ngân hàng KienLongBank.

**POST** **/klb/bankAccount/lookUpAccountHolderName**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| account\_number | Số tài khoản ngân hàng KienLongBank | `required`, `string`, `max_length[20]` |

**Response**  
**{**  
   **"code": 200,**  
   **"data": {**  
       **"account\_holder\_name": "string"**  
   **}**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số tài khoản không tồn tại trên hệ thống ngân hàng KienLongBank |
| 504 | Hệ thống KienLongBank đang bận |

### API Thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/klb/bankAccount/create**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| company\_id | ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản sắp tạo | `required`, `string` |
| account\_number | Số tài khoản ngân hàng MB cần liên kết | `required`, `string`, `max_length[20]` |
| label | Tên gợi nhớ | `nullable`, `max_length[100]` |

**Response `2011`:** Thêm tài khoản liên kết ngân hàng KienLongBank thành công với trạng thái tài khoản ngân hàng KienLongBank hiện chưa được liên kết API với SePay trên hệ thống ngân hàng.  
**{**  
   **"code": 2011,**  
   **"message": "Đã thêm tài khoản ngân hàng và gửi OTP xác thực liên kết API.",**  
   **"id": "\<CREATED\_BANK\_ACCOUNT\_ID\>",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

Giá trị `<REQUEST_ID>` sẽ được dùng để xác thực cho [API Xác nhận thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp). Đồng thời lúc này, hệ thống ngân hàng KienLongBank cũng gửi OTP đến số điện thoại đã dùng để đăng ký tài khoản ngân hàng KienLongBank.

**Response `2012`:** Thêm tài khoản liên kết ngân hàng KienLongBank thành công với trạng thái tài khoản ngân hàng KienLongBank đang được liên kết API với SePay trên hệ thống ngân hàng.  
**{**  
   **"code": 2011,**  
   **"message": "Đã liên kết API tài khoản ngân hàng thành công.",**  
   **"id": "\<CREATED\_BANK\_ACCOUNT\_ID\>"**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | Số tài khoản đã tồn tại trên hệ thống SePay |
| 4004 | Số tài khoản không tồn tại trên hệ thống ngân hàng KienLongBank |
| 504 | Hệ thống KienLongBank đang bận |

### API Xác nhận thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Xác nhận thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/klb/bankAccount/confirmApiConnection**

**Headers**

| Trường | Giá trị | Mô tả |
| :---- | :---- | :---- |
| Request-Id | `<REQUEST_ID>` | Giá trị được trả về ở response `2011` của [API Thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp) hoặc được trả về ở response của [API Yêu cầu liên kết tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp) |

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| otp | Mã OTP được gửi tới số điện thoại đã dùng để đăng ký tài khoản ngân hàng KienLongBank | `required`, `string`, `regex_match[/^[0-9]{6}$/]` |

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã liên kết API tài khoản ngân hàng KienLongBank thành công.",**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 4001 | OTP không chính xác hoặc đã hết hiệu lực |
| 504 | Hệ thống KienLongBank đang bận |

### API Yêu cầu liên kết tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-yêu-cầu-liên-kết-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Gửi yêu cầu liên kết tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant. API này hữu ích cho việc gửi lại mã OTP và tạo `<REQUEST_ID>` cho [API Xác nhận thêm tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp](#api-xác-nhận-thêm-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp).

**POST** **/klb/bankAccount/requestApiConnection/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gửi OTP xác thực liên kết API.",**  
   **"data": {**  
       **"request\_id": "\<REQUEST\_ID\>"**  
   **}**  
**}**

**Bảng mã lỗi**

| 409 | Tài khoản ngân hàng đã được liên kết API trước đó |
| :---- | :---- |
| 504 | Hệ thống KienLongBank đang bận |

### API Xóa tài khoản chưa liên kết API trước đó ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-xóa-tài-khoản-chưa-liên-kết-api-trước-đó-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Trong các trường hợp tài khoản ngân hàng chưa được liên kết OTP trước đó, quý đối tác có thể sử dụng API này để xóa tài khoản ngân hàng này trên hệ thống SePay BankHub không cần xác thực OTP.

**POST** **/klb/bankAccount/forceDelete/{bankAccountId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã gỡ tài khoản ngân hàng thành công."**  
**}**

**Bảng mã lỗi**

| 400 | Tài khoản ngân hàng này đang liên kết API, vui lòng hủy liên kết theo luồng OTP. |
| :---- | :---- |

### API Tạo VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-tạo-va-cho-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Tất cả VA của ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp được tạo từ hệ thống SePay sẽ được tạo bởi dãy số ngẫu nhiên.

Tạo VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/klb/VA/create**

**JSON payload**

| Trường | Mô tả | Quy tắc ràng buộc |
| :---- | :---- | :---- |
| bank\_account\_id | ID tài khoản ngân hàng KienLongBank thuộc quyền quản lý của Merchant sở hữu VA sắp tạo | `required`, `string` |
| company\_id | ID công ty (tổ chức) thuộc quyền quản lý của Merchant sở hữu tài khoản ngân hàng | `required`, `string` |
| label | Tên gợi nhớ | `nullable`, `max_length[100]` |

**Response**  
**{**  
   **"code": 201,**  
   **"message": "Đã tạo VA thành công.",**  
   **"id": "\<CREATED\_VA\_ID\>"**  
**}**

**Bảng mã lỗi**

| 400 | Thông tin đầu vào không hợp lệ |
| :---- | :---- |
| 504 | Hệ thống KienLongBank đang bận |

### API Kích hoạt lại VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-kích-hoạt-lại-va-cho-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Kích hoạt lại VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/klb/VA/enable/{vaId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã kích hoạt lại VA thành công."**  
**}**

**Bảng mã lỗi**

| 400 | VA đang hoạt động, không thể kích hoạt nữa |
| :---- | :---- |
| 504 | Hệ thống KienLongBank đang bận |

### API Vô hiệu hóa VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-vô-hiệu-hóa-va-cho-tài-khoản-liên-kết-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Vô hiệu hóa VA cho tài khoản liên kết ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp cho một công ty (tổ chức) bất kỳ thuộc quyền quản lý của Merchant.

**POST** **/klb/VA/disable/{vaId}**

**Response**  
**{**  
   **"code": 200,**  
   **"message": "Đã vô hiệu hóa VA thành công."**  
**}**

**Bảng mã lỗi**

| 400 | VA đã bị vô hiệu hóa, không thể thực hiện lại nữa |
| :---- | :---- |
| 504 | Hệ thống KienLongBank đang bận |

### API Truy vấn danh sách VA thuộc tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-truy-vấn-danh-sách-va-thuộc-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Lấy danh sách VA của tài khoản ngân hàng KienLongBank thuộc quyền quản lý của Merchant.

**GET** **/klb/VA**

**Query params**

| Trường | Kiểu dữ liệu | Mô tả |
| :---- | :---- | :---- |
| per\_page | string | Số bản ghi trên trang |
| q | string | Từ khóa tìm kiếm theo số VA và tên gợi nhớ |
| company\_id | string | Lọc theo ID công ty (tổ chức) sở hữu VA |
| bank\_account\_id | string | Lọc theo tài khoản ngân hàng KienLongBank sở hữu VA |

**Response shema**  
**{**  
   **"data": *Array\<*[VAModel](#model-va)*\>*,**  
   **"meta": {**  
       **"per\_page": "number",**  
       **"total": "number",**  
       **"has\_more": "boolean",**  
       **"current\_page": "number",**  
       **"page\_count": "number"**  
   **}**  
**}**

### API Truy vấn chi tiết VA thuộc tài khoản ngân hàng KienLongBank dành cho cá nhân/doanh nghiệp {#api-truy-vấn-chi-tiết-va-thuộc-tài-khoản-ngân-hàng-kienlongbank-dành-cho-cá-nhân/doanh-nghiệp}

Xem thông tin chi tiết một VA bất kỳ thuộc thuộc tài khoản ngân hàng KienLongBank dành cho cá nhân thuộc quyền quản lý của Merchant.

**GET** **/klb/VA/details/{vaId}**

**Response schema**  
**{**  
   **"data": [VAModel](#model-va)**  
**}**

## Tài khoản ngân hàng {#tài-khoản-ngân-hàng}

Bộ API quản lý chung tài khoản ngân hàng thuộc quyền quản lý của Merchant.

### API Truy vấn danh sách tài khoản ngân hàng {#api-truy-vấn-danh-sách-tài-khoản-ngân-hàng}

Lấy danh sách tài khoản ngân hàng thuộc quyền quản lý của Merchant.

**GET** **/bankAccount**

**Query params**

| Trường | Kiểu dữ liệu | Mô tả |
| :---- | :---- | :---- |
| per\_page | string | Số bản ghi trên trang |
| q | string | Từ khóa tìm kiếm theo tên chủ thẻ, số tài khoản và tên gợi nhớ |
| company\_id | string | Lọc theo ID công ty (tổ chức) sở hữu tài khoản ngân hàng |
| bank\_id | string | Lọc theo ID ngân hàng |

**Response shema**  
**{**  
   **"data": *Array\<*[BankAccountModel](#model-tài-khoản-ngân-hàng)*\>*,**  
   **"meta": {**  
       **"per\_page": "number",**  
       **"total": "number",**  
       **"has\_more": "boolean",**  
       **"current\_page": "number",**  
       **"page\_count": "number"**  
   **}**  
**}**

### API Truy vấn chi tiết tài khoản ngân hàng {#api-truy-vấn-chi-tiết-tài-khoản-ngân-hàng}

Xem thông tin chi tiết một tài khoản ngân hàng bất kỳ thuộc quyền quản lý của Merchant.

**GET** **/bankAccount/details/{bankAccountId}**

**Response schema**  
**{**  
   **"data": [BankAccountModel](#model-tài-khoản-ngân-hàng)**  
**}**

## Lịch sử giao dịch {#lịch-sử-giao-dịch}

Bộ API quản lý lịch sử giao dịch thuộc quyền quản lý của Merchant.

### API Truy vấn lịch sử giao dịch {#api-truy-vấn-lịch-sử-giao-dịch}

Lấy danh sách lịch sử giao dịch thuộc quyền quản lý của Merchant.

**GET** **/transaction**

**Query params**

| Trường | Kiểu dữ liệu | Mô tả |
| :---- | :---- | :---- |
| per\_page | string | Số bản ghi trên trang |
| q | string | Từ khóa tìm kiếm theo nội dung giao dịch, mã tham chiếu FT, mã thanh toán, số VA |
| company\_id | string | Lọc theo ID công ty (tổ chức) sở hữu giao dịch |
| bank\_id | string | Lọc theo ID ngân hàng |
| bank\_account\_id | string | Lọc theo ID tài khoản ngân hàng sở hữu giao dịch |
| transaction\_date | Y-m-d hoặc Y-m-d H:i:s | Lọc theo ngày giao dịch |
| start\_transaction\_date | Y-m-d hoặc Y-m-d H:i:s | Lọc theo ngày bắt đầu |
| end\_transaction\_date | Y-m-d hoặc Y-m-d H:i:s | Lọc theo ngày kết thúc |
| transfer\_type | “credit” | “debit” | Lọc theo loại giao dịch (tiền vào hoặc tiền ra) |
| va\_id | string | Lọc theo ID VA thuộc giao dịch |

**Response**  
**{**  
   **"data": *Array\<*[TransactionModel](#model-lịch-sử-giao-dịch)*\>*,**  
   **"meta": {**  
       **"per\_page": "number",**  
       **"total": "number",**  
       **"has\_more": "boolean",**  
       **"current\_page": "number",**  
       **"page\_count": "number"**  
   **}**  
**}**

### API Truy vấn chi tiết lịch sử giao dịch {#api-truy-vấn-chi-tiết-lịch-sử-giao-dịch}

Xem thông tin chi tiết một giao dịch bất kỳ thuộc quyền quản lý của Merchant.

**GET** **/transaction/details/{transactionId}**

**Response schema**  
**{**  
   **"data": [TransactionModel](#model-lịch-sử-giao-dịch)**  
**}**

# 3\. Đặc tả yêu cầu API nhận biến động số dư (IPN) cho Merchant {#3.-đặc-tả-yêu-cầu-api-nhận-biến-động-số-dư-(ipn)-cho-merchant}

Khi nhận bất kỳ giao dịch nào thuộc tài khoản ngân hàng mà thuộc quyền quản lý của Merchant, SePay sẽ thực hiện thông báo cho Merchant bằng cách gọi API nhận biến động số dư (IPN) mà Merchant cung cấp trước đó.

**Yêu cầu IPN URL**  
Phía Merchant có thể tùy ý lựa chọn cấu trúc đường dẫn để nhận biến động số dư và thông báo lại cho SePay để cấu hình tích hợp.

**Định dạng JSON payload**  
Nội dung JSON payload SePay gửi đến IPN của Merchant khi có giao dịch từ tài khoản ngân hàng có dạng:  
**{**  
   **"gateway": "string",**  
   **"transaction\_date": "Y-m-d H:i:s",**  
   **"account\_number": "string",**  
   **"bank\_account\_id": "string",**  
   **"va": "string" | null,**  
   **"payment\_code": "string" | null,**  
   **"content": "string",**  
   **"transfer\_type": "credit" *|* "debit",**  
   **"amount": "number",**  
   **"reference\_code": "string",**  
   **"accumulated": "number",**  
   **"transaction\_id": "string"**  
   **"id": "number" // @deprecated**  
**}**

| gateway | Tên cổng thực hiện. Ví dụ: “MBBank”, “OCB” |
| :---- | :---- |
| transaction\_date | Thời gian nhận giao dịch |
| account\_number | Số tài khoản |
| bank\_account\_id | ID tài khoản ngân hàng tương ứng |
| va | Số VA (nếu có) |
| payment\_code | Mã thanh toán (nếu có) |
| content | Nội dung giao dịch |
| transfer\_type | Loại giao dịch (credit: tiền vào, debit: tiền ra) |
| amount | Số tiền giao dịch (số không âm) |
| reference\_code | Mã tham chiếu FT |
| accumulated | Số dư sau giao dịch (hiện chưa hỗ trợ tính năng này nên giá trị mặc định là 0\) |
| transaction\_id | ID giao dịch |
| id (deprecated) | ID giao dịch |

**Yêu cầu Response**

* Nội dung trả về với `Content-Type` là `application/json`  
* JSON fragment có dạng:  
  **{**  
     **"success": true,**  
     **// ...**  
  **}**  
* HTTP status code phải là `200` hoặc `201`

**Yêu cầu bảo mật**

* URL IPN phía Merchant cung cấp phải hỗ trợ SSL  
* Mặc định, SePay gọi tới IPN của Merchant kèm với header `Authorization` với giá trị là `Apikey {API_KEY}`, trong đó `{API_KEY}` là khóa bảo mật mà SePay sẽ cung cấp cho phía Merchant trước đó. Merchant có thể kiểm tra tính đúng đắn của header `Authorization` để xác nhận đó là request từ SePay.  
* Hoặc phía Merchant có thể lọc địa chỉ IP gọi tới, SePay sẽ cung cấp các IP address để Merchant thêm vào whitelist.  
* Hoặc Merchant có thể áp dụng cả 2 lớp bảo mật trên.

**Điều kiện SePay thông báo IPN tới Merchant**  
Để một công ty (tổ chức) thuộc quyền quản lý của Merchant có thể nhận thông báo IPN từ SePay phải đạt đủ các điều kiện sau đây:

* Công ty (tổ chức) sở hữu tài khoản ngân hàng nhận thông báo phải ở trạng thái Hoạt động (`status: Active` và `active: 1`), xem thêm tại [API truy vấn chi tiết công ty (tổ chức)](#api-truy-vấn-chi-tiết-công-ty-\(tổ-chức\)).  
* Cấu hình `transaction_amount` của công ty (tổ chức) sở hữu tài khoản ngân hàng nhận thanh toán phải có giá trị lớn hơn 0 hoặc giá trị `”Unlimited”`, xem thêm tại [API truy vấn cấu hình công ty (tổ chức)](#api-truy-vấn-cấu-hình-công-ty-\(tổ-chức\)).

**Cơ chế retry**  
SePay sẽ thực hiện retry thông báo có giao dịch mới tới IPN của Merchant khi và chỉ khi bị lỗi mạng (kết nối mạng thất bại). Thời gian gọi cách nhau bằng phút, tăng dần theo dãy số [Fibonacci](https://en.wikipedia.org/wiki/Fibonacci_sequence).

* Số lần gọi lại tối đa là 7 lần  
* Tối đa là 5 giờ kể từ khi gọi lần đầu thất bại  
* Network connect timeout của SePay là 5 giây  
* Thời gian chờ phản hồi tối đa của SePay là 8 giây

**Yêu cầu chống trùng lặp giao dịch**  
Để tránh trùng lặp giao dịch khi phát sinh các sự cố với kết nối IPN của phía merchant tại cơ chế retry. SePay khuyến nghị merchant xử lý chống trùng lặp giao dịch khi nhận thông báo biến động giao dịch từ SePay thông qua IPN.

Merchant cần kiểm tra tính duy nhất của trường `transaction_id`, hoặc kết hợp thêm các trường khác như `reference_code`, `transfer_type`, `amount` để đảm bảo tính duy nhất của giao dịch.

---

*(hết)*

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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7lams+W6XiSqOlhXLRJVlZGoEjGS97ITxi9c7giJquYjUSVRlVvS0py2rj2+/PLLpFu3bs5KFzK59dZbkyeffNJV1Gro06dPsnjx4nC1Y+vWre4cPvfee687x9ChQyu6qjdt2uQKWl548cUXkzvuuCM5f/68s1qhwSPtf/zxR3kdFQyz62/Wu3fv5K233irvx/VYuHChs87Q2TIhhJH3shPGL1z227XQPv30U/f7008/Ocsavy3sqH0repuKKMHef//9Nuu3bNmS3HbbbcnevXvbrG8mmzdvdnGAZ555xl07zNi5c6fbjh06dKi8vlrWr1/v2vlK4vby5ctJjx49XH7169evTflLu2YQluusKdWR5p40D6SlOW1dJQ4cOOD2f/75552R2RiFgvWvvPJKeEgqFMJKqv7RRx9NxowZU17ev39/MmHCBFdYR48e7c6XRq0NQBZeJJ7upk2b5p4s6mHXrl3lBv3DDz8sr7frzvq1a9cmJ06cSA4fPpzMmzfPreOaAddjwYIFzjpDZ8qEED55Lzth/MJlvO9Hjhxxxrb58+eXl6nPrKtVVHW2rfHbwo7at6K3qbRjGKLWB6H43XfftVnXbL744gsnaIB85/pZGwvE8auvvko2btyYrF69ury+WjoSVRs2bEhef/315JtvvkmeffbZNtvSrhmE5TprSvep5p40D6SlOW1dJUaOHJkMGDAgXO1YunRpMmPGjPLymjVryuoaGzJkSNldSQVft25deV9YuXKlM9vfwvLD8cMIoQHgSWHSpEmuIejVq1ebJzAaROJPOBRCPDo8wZF+xMtLL73kjCcRzkNYPI2keZkQTRj7sh/xmzNnTnk7gop13bt3Tx555BFn5sVjcOHdd9/t4nHnnXe6iliJiRMnun2JB7+GL6r8J9AbN264cOfOneuWJapEs8l72QnjFy77sG3VqlXlZatzU6ZMcUYdpy0xDxFelcGDB5f3p25iw4YNcw881M2rV68mu3fvdp4llqnXPKyGhG1h2L6FbVyR21SEit/7wfUCBErfvn3dcffcc497cISO2l9j0KBBzrg3GfwfMWJEu3kV4osq2lJzKsC1a9dcO03cuT7Lli1z67dv357cddddzhBCdv24PiGhqOK6Erfp06e7ZcKy68D1PnXqlDO7bv41M9or11nA+W5p9knzQFqa09ZVApEwe/bsNusY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GWdkR33NMccc0+yxxx7l7uawww5rfvKTn5S7E0cffXSz1157lbsn5umnn2522mmnFBCrq8HZZ5+dAs+UZ74cwTnJfbj66qtTmXn77bfLn6YC3tZNN920OfPMM8uflgz3iDpCfbjrrrtSvoJHHnlk8AJC+Nvf/padOZpabI6IoqouqhJVr776agr8f/fddyeBhVDZd999075f/OIXi8656qqrml/96lfNr3/96+aiiy5a9NtKMImouuOOO9K1H3zwweb4448vfx5w6623NhtttNGifTTqJ5988jc8KwhEvDUlhx56aPPjH/+43J2YREyMg/tMoIGeNv/4xz+a4447LgVEx/nnn9+sXbu2PGwsk96HW265pfnd735X7p4ar7/+errXiPIA79xSPXQhqigvlKdc2F9++eXNAw88kMKdd97Z3HzzzdmZo6nF5ogoquqiWlH16KOPLvr9yCOPHLyFRxfPCSecMPBU/ehHP0rdcECjet555yVvR7yl49UK8YIQ22yzzZJgwlO08847D66Tg6jCC7X77rsnTz5KVKkAABleSURBVBTH5w39qDQEMf4LQUW+dtxxx7SfBm7LLbdM5+22227NSy+9NDjnkksuaU488cTBdlCKqj/96U/Nt7/97dRgIia22267lBfi3HbbbZs333xzcCzdk5EP0vLzn/988FueljI9CMajjjoq7Yt4EQSEknHH0uiTBq6/9957N4ccckgSxPDwww+ne0PgXPJy7733Do034i5puw/5veDvPvvsk37jeYZQpzsOzyGB+89zJ53xO88a0bzxxhs33/3ud1PgGZ1yyimDa8OLL76Y4njssccW7ads4JmiXFJmgnPPPbc59dRTk4cw4oW4H+W9KMlFFcJ+hx12SPs//fTTVF7IA4HyTnmGyGtbPoNabI6IoqouqhJVNFAE/t9vv/1S43PTTTel3/FcsZ+GGUFAQCDQSN1zzz1J2CC8gMaSY/FknXXWWSmwvWbNmuaNN95I///sZz9rLrvsstRoEU8bNEIcu+uuuybPBvHSqNKQEUalIcATQcAjxbVoLGnw+J/zaAi/853vND/84Q8H5yAMEB8lIaqi+5Nrh3eMc0jrEUcc0Vx//fUpLXnjTR5IO/mg+4tjEWNlWsr0RLx4kIiXY8OjVDLuWNJOY47XjvxxbDTmpA2xQyANHEuDz7ijtngj7pK2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XNr30UcfNZtsskmz3nrrpWkdQvA8//zzzXXXXZdCGzfeeGO6Bhx99NHNXnvtlcIwXnnllWaDDTZobr311hSk32hXRepDUSWrD1/y/fzn/9p++OGvw1fl8n8WBE5b4DeOSYHjAwatE+cYSlF18803p+2f/vSnKQR33HFHc+GFFzYPPfTQQGgBwmejjTZKoY1NN910ILgmEVV33XVXc+edd5a7padoV0XqQ1Elq4+iKqGomi+0qyL1oaiS1eW115rm3/990a53/uu/Uti3RUiVgWMIHL8I4iTuEeSi6qabbkr/n3/++eVhzf33399sueWWqWtu9913b958883UBYiYinTsuOOOi8458sgj037GXyGWEFXbbbddCjvvvHOKa9ttt01xffjhh83mm28+EHcffPBBCux7/fXX077rr7++2XjjjdN5Bx54YPOJXznOPNpVkfpYaBOs/LJKfCVm0nQIwYMPNi+vv34KpYAaFTiecwcQJ3GPIETV2Wefnf7uu+++5SHNq6++mn5DyNxzzz1JFCGwGGd18sknJ5FDeDj3lH3FE088kUQXnq033ngjiapI6xFHHJFEEoLrhBNOaN599920P8ZqMSCekPL1ldBau3Zt+v+cc85JXjPE1VVXXbXoejJ78MxEpC4W7LyVX1aJ009fPI3CueemQeiEUjiNChzPuQOIk7hHEKKKgFeIvy/kk4x+xVlnnZXEz5dffpm2EUscx6DypXb/bbHFFikEhx56aLPrrruOFVWHHXZYEnIBnq9LL710sC2zCc9PROpioU2x8ssqwVp++Xp+rO/3VXkklMJpVOD4Mp5F2y2EqDr3KzFGFxziaJtttkkCKkTUAQcc8I1rEfAeLVVU7bHHHikEJ510UrPDDjt8Q1Th2SKwD1FFdyHpkH7B8xORulhoI6z8skrMgKcqxjKtWbMmbV988cUpAGOj8GLR3UdAAN13333Np59+umRRVQ5UL0XVU089lfY/8sgjKUTa6EL87ne/OzjvgQceSNM1yGyjXRWpj4U2ycovq8QMjKnK56naf//9B3HiOeJrPP5nPBUTgCJwGEP12WefNbfffvtgTBXbJZtttllzEYs+N6NFFV4x5sA65ZRTkscsjou0PfhVvvgdMcfAduK9/PLLB/HIbMLzE5G6WGg/rPyySszI13/Be++9l8ZQEZjoEw4++ODB9RBQd999d9rPeSGqGDxecvjhh6dz8FYNE1Xx1SBiLa7BF4aESNsXX3zR7LnnnoPft99+e7/+6wE8KxGpiwU7beWXVYQ5pZhbKljXeaqY82qCeaqWAlMbMI6qFDN4qAjvv//+ov3BW2+9NXZpmoBuQMIw8FIxgF36gXZVpD4UVbL6rNIyNSJdol0VqQ9FlcwGS1xQ+Yujj57qgsoiS0W7KlIfiiqZDRRVMmdoV0XqQ1Els8P3vrd4eoWlwrnEITIDaFdF6kNRJbMDg8C///2vp0MgrF1bHvFNOIbA8ZzrV3EyI2hXRepDUSWzB18CEhiIvssuTXPttU2TLx/D/+zjN44h5F8PiswA2lWR+lBUyeyC14nJM5ke4VvfGoypSv+zj984Ru+UzCDaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepDUSUi0gHaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepDUSUi0gHaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepDUSUi0gHaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepDUSUi0gHaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepDUSUi0gHaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepDUSUi0gHaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepDUSUi0gHaVZH6UFSJiHSAdlWkPhRVIiIdoF0VqQ9FlYhIB2hXRepjIKoMBoPBYDAYDOsW/j85qe0UZ2fWlwAAAABJRU5ErkJggg==>