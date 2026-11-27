# ResMan Menu API – Kiến trúc hợp nhất

## Nguồn nghiệp vụ

- `menu-categories/`: CRUD danh mục.
- `menu-items/`: CRUD món, giá, trạng thái, ảnh, tìm kiếm/lọc và API đọc thực đơn công khai cho Customer.
- Không còn module/controller/service/DTO trong `backend/src/menu/`.
- Customer Order không tự quản lý giá; `OrdersService` đọc giá hiện tại từ PostgreSQL và tạo snapshot đơn hàng.

## API

Base URL: `/api/v1`

### Danh mục – cần JWT và permission

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/menu-categories` | Danh sách, tìm kiếm/lọc danh mục |
| GET | `/menu-categories/:id` | Chi tiết danh mục và món |
| POST | `/menu-categories` | Tạo danh mục |
| PATCH | `/menu-categories/:id` | Cập nhật danh mục |
| DELETE | `/menu-categories/:id` | Xóa danh mục rỗng |

### Món ăn – cần JWT và permission

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/menu-items` | Tìm kiếm, lọc, phân trang, sắp xếp |
| GET | `/menu-items/:id` | Chi tiết món |
| POST | `/menu-items` | Tạo món |
| PATCH | `/menu-items/:id` | Cập nhật thông tin và giá |
| DELETE | `/menu-items/:id` | Xóa nếu chưa được dùng trong đơn |
| PATCH | `/menu-items/:id/status` | Cập nhật trạng thái kinh doanh |
| POST | `/menu-items/:id/image` | Upload ảnh, multipart field `file` |
| DELETE | `/menu-items/:id/image` | Xóa ảnh |

### Customer – chỉ đọc, không cần JWT

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/menu-items/customer/menu` | Thực đơn đang bán, nhóm theo danh mục |

API tạo đơn vẫn thuộc `guest/session`; không chuyển xử lý Order vào module Menu.

## Quy tắc bốn loại giá

| pricingType | price | priceUnit | Customer có thể tự đặt? |
|---|---:|---|---|
| `FIXED` | Bắt buộc | Không bắt buộc; có thể là `con`, `nồi`... | Có |
| `PER_UNIT` | Bắt buộc | Bắt buộc, ví dụ `lạng`, `kg` | Có |
| `MARKET_PRICE` | Phải là `null` | `null` | Không, liên hệ nhân viên |
| `UNSET` | Phải là `null` | `null` | Không, liên hệ nhân viên |

Database migration đã có CHECK constraint cho tính nhất quán giá và yêu cầu đơn vị của `PER_UNIT`. Backend cũng kiểm tra lại trước khi ghi. Customer không gửi đơn giá; backend lấy giá trong database. Với `PER_UNIT`, `quantity` là số đơn vị tính (ví dụ số lạng).

## Seed

`npm run db:seed` dùng upsert theo mã danh mục và mã món ổn định. Khi chạy lại, seed đồng bộ tên danh mục, tên món, danh mục, giá, loại giá và đơn vị; giữ nguyên trạng thái kinh doanh và ảnh do quản lý cập nhật. Không xóa dữ liệu không còn trong danh sách seed.

## Kiểm tra an toàn

Chạy từ thư mục `backend/`:

```bash
npm run prisma:validate
npm run prisma:generate
npx prisma migrate status --config ./prisma.config.ts
npm run build
npm run db:seed
```

Database được dùng chung: không chạy `prisma migrate dev`, reset database hoặc sửa/xóa migration đã áp dụng. Chỉ chạy `prisma migrate deploy` khi `migrate status` xác nhận có migration pending và các thành viên thống nhất thời điểm triển khai.

## Kiểm thử thủ công

1. Tạo danh mục qua `POST /menu-categories`.
2. Tạo lần lượt món `FIXED`, `PER_UNIT`, `MARKET_PRICE`, `UNSET` qua `POST /menu-items`.
3. Kiểm tra `GET /menu-items` và `GET /menu-items/customer/menu`: Customer chỉ thấy món đang active và AVAILABLE; bốn loại giá vẫn được trả về.
4. Thử cập nhật loại giá: `PER_UNIT` thiếu `priceUnit`, hoặc `MARKET_PRICE` có giá số, phải bị từ chối.
5. Gửi Order với món `FIXED`/ `PER_UNIT`: backend phải dùng giá database. Gửi `MARKET_PRICE`/ `UNSET`: backend phải từ chối.
6. Upload ảnh JPG/JPEG/PNG/WEBP nhỏ hơn 5MB bằng field `file`; kiểm tra URL trả về, tải lại danh sách để xác nhận ảnh vẫn hiển thị. Thử đổi ảnh, xóa ảnh và cập nhật trạng thái; Customer menu phải phản ánh thay đổi.
