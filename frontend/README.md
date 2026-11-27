# ResMan — Ứng Dụng Quản Lý Nhà Hàng Đa Nền Tảng (React Native & Expo)

ResMan được xây dựng theo kiến trúc **Feature-based Architecture** kết hợp **Repository Pattern**, hỗ trợ **Android, iOS, Tablet và Web** trên cùng một codebase React Native + TypeScript.

## Cấu Trúc Dự Án

- `app/` — Khai báo tuyến điều hướng chuẩn Expo Router (`_layout.tsx`, `index.tsx`, `login.tsx`, `(main)/*`).
- `src/features/` — Phân tách theo từng nghiệp vụ: `auth`, `dashboard`, `menu`, `customer-order`, `orders`, `kds`, `inventory`, `employees`, `reports`.
- `src/repositories/` — Tách biệt `interfaces/`, `mock/`, và `api/` theo Repository Pattern.
- `src/data/mock/` — Nguồn dữ liệu giả lập tập trung và đồng bộ liên module.
- `src/services/` — `apiClient.ts` (Axios + JWT + 401 handler) và `storageService.ts` (AsyncStorage).
- `src/constants/rbac.ts` — Phân quyền RBAC tập trung cho 5 vai trò (`MANAGER`, `ORDER_STAFF`, `KITCHEN_STAFF`, `INVENTORY_STAFF`, `GUEST`).
- `src/theme/` — Token màu sắc, typography và hỗ trợ Light / Dark Theme.

## Chuyển Đổi Mock Data sang Backend NestJS

Chỉnh sửa `.env`:
```env
EXPO_PUBLIC_API_URL=https://your-nestjs-api.example.com/api/v1
EXPO_PUBLIC_USE_MOCK_DATA=false
```
Khi `EXPO_PUBLIC_USE_MOCK_DATA=false`, `src/repositories/index.ts` tự động sử dụng các `Api*Repository` gọi tới API `/api/v1/*`.
