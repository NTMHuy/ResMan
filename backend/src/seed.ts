import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import * as bcrypt from "bcrypt";

const roleDefinitions = [
  { code: "MANAGER", name: "Quản lý" },
  { code: "ORDER_STAFF", name: "Nhân viên Order" },
  { code: "KITCHEN_STAFF", name: "Nhân viên Bếp" },
  { code: "INVENTORY_STAFF", name: "Nhân viên Kho" },
];

const permissionDefinitions = [
  ["users:read", "Xem người dùng", "users"],
  ["users:create", "Tạo người dùng", "users"],
  ["users:update", "Cập nhật người dùng", "users"],

  ["menu:read", "Xem thực đơn", "menu"],
  ["menu:manage", "Quản lý thực đơn", "menu"],

  ["menu.category.create", "Tạo danh mục", "menu"],
  ["menu.category.read", "Xem danh mục", "menu"],
  ["menu.category.update", "Cập nhật danh mục", "menu"],
  ["menu.category.delete", "Xóa danh mục", "menu"],
  ["menu.item.create", "Tạo món ăn", "menu"],
  ["menu.item.read", "Xem món ăn", "menu"],
  ["menu.item.update", "Cập nhật món ăn", "menu"],
  ["menu.item.delete", "Xóa món ăn", "menu"],

  ["tables:read", "Xem bàn", "tables"],
  ["tables:manage", "Quản lý bàn", "tables"],
  ["sessions:open", "Mở phiên bàn", "sessions"],
  ["sessions:close", "Đóng phiên bàn", "sessions"],
  ["orders:read", "Xem đơn hàng", "orders"],
  ["orders:create-item", "Thêm món vào đơn", "orders"],
  ["orders:manage-item", "Quản lý món trong đơn", "orders"],
  ["kitchen:read", "Xem hàng đợi bếp", "kitchen"],
  ["kitchen:update-item", "Cập nhật trạng thái món", "kitchen"],
  ["inventory:read", "Xem kho", "inventory"],
  ["inventory:manage", "Quản lý kho", "inventory"],
  ["inventory:count", "Kiểm kê kho", "inventory"],
  ["payments:read", "Xem thanh toán", "payments"],
  ["payments:confirm", "Xác nhận thanh toán", "payments"],
  ["reports:read", "Xem báo cáo", "reports"],
] as const;

const rolePermissions: Record<string, string[]> = {
  MANAGER: permissionDefinitions.map(([code]) => code),
  ORDER_STAFF: [
    "tables:read",
    "sessions:open",
    "sessions:close",
    "orders:read",
    "orders:create-item",
    "orders:manage-item",
    "payments:read",
    "payments:confirm",
  ],
  KITCHEN_STAFF: ["kitchen:read", "kitchen:update-item"],
  INVENTORY_STAFF: ["inventory:read", "inventory:manage", "inventory:count"],
};

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const username = process.env.INITIAL_ADMIN_USERNAME?.trim();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const fullName = process.env.INITIAL_ADMIN_FULL_NAME?.trim();
  const employeeCode = process.env.INITIAL_ADMIN_EMPLOYEE_CODE?.trim();

  if (!databaseUrl || !username || !password || !fullName || !employeeCode) {
    throw new Error(
      "Thiếu DATABASE_URL hoặc thông tin INITIAL_ADMIN_* trong backend/.env",
    );
  }

  if (password.length < 12) {
    throw new Error("INITIAL_ADMIN_PASSWORD phải có ít nhất 12 ký tự");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const roles = new Map<string, bigint>();

    for (const definition of roleDefinitions) {
      const role = await prisma.role.upsert({
        where: { code: definition.code },
        update: { name: definition.name },
        create: definition,
      });

      roles.set(role.code, role.id);
    }

    const permissions = new Map<string, bigint>();

    for (const [code, name, module] of permissionDefinitions) {
      const permission = await prisma.permission.upsert({
        where: { code },
        update: { name, module },
        create: { code, name, module },
      });

      permissions.set(code, permission.id);
    }

    for (const [roleCode, codes] of Object.entries(rolePermissions)) {
      const roleId = roles.get(roleCode);

      if (!roleId) {
        throw new Error(`Không tìm thấy role ${roleCode}`);
      }

      for (const code of codes) {
        const permissionId = permissions.get(code);

        if (!permissionId) {
          throw new Error(`Không tìm thấy permission ${code}`);
        }

        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId, permissionId },
          },
          update: {},
          create: { roleId, permissionId },
        });
      }
    }

    const managerRoleId = roles.get("MANAGER");

    if (!managerRoleId) {
      throw new Error("Không tạo được role MANAGER");
    }

    const existing = await prisma.user.findUnique({
      where: { username },
      select: { id: true, roleId: true },
    });

    let userId: bigint;

    if (existing) {
      if (existing.roleId !== managerRoleId) {
        throw new Error(
          "INITIAL_ADMIN_USERNAME đã tồn tại nhưng không thuộc role MANAGER",
        );
      }

      userId = existing.id;
    } else {
      const user = await prisma.user.create({
        data: {
          username,
          passwordHash: await bcrypt.hash(password, 12),
          roleId: managerRoleId,
        },
        select: { id: true },
      });

      userId = user.id;
    }

    await prisma.employee.upsert({
      where: { userId },
      update: { fullName, employeeCode },
      create: { userId, fullName, employeeCode },
    });

    // Tạo sẵn 20 bàn cố định; upsert giúp chạy seed nhiều lần không tạo trùng.
    for (let number = 1; number <= 20; number += 1) {
      const code = `T${String(number).padStart(2, "0")}`;
      await prisma.diningTable.upsert({
        where: { code },
        update: { name: `Bàn ${String(number).padStart(2, "0")}` },
        create: {
          code,
          name: `Bàn ${String(number).padStart(2, "0")}`,
          capacity: 4,
          status: "AVAILABLE",
        },
      });
    }

    console.log(
      "Đã khởi tạo roles, permissions và tài khoản quản lý đầu tiên.",
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
