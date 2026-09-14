# Restaurant Workflow Reference

> **Provenance**
>
> - **Source prompt:** Restaurant Management System Project Vision
> - **Artifact status:** `Draft - Awaiting Review`

## 1. Mục đích

Tài liệu mô tả workflow nghiệp vụ tổng quát được sử dụng làm context cho việc phân tích yêu cầu của Hệ thống Quản lý Nhà hàng.

Đây là business reference, không phải technical design.

---

## 2. Main Actors

Hệ thống có 5 vai trò chính:

1. Customer
2. Order Staff
3. Kitchen Staff
4. Inventory Staff
5. Manager

---

## 3. Core Information Flow

Workflow tổng quát:

```text
Customer
   ↓
Create Order
   ↓
Order Staff
   ↓
Confirm / Manage Order
   ↓
Kitchen
   ↓
Prepare Food
   ↓
Order Completed
   ↓
Customer Tracking

Inventory
   ↓
Monitor / Update Stock
   ↓
Support Restaurant Operations

Manager
   ↓
Monitor Operations
   ↓
Reports / Staff Management
```
