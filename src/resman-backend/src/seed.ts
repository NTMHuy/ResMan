import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import * as bcrypt from 'bcrypt';

const roleDefinitions = [
  { code: 'MANAGER', name: 'Quản lý' },
  { code: 'ORDER_STAFF', name: 'Nhân viên Order' },
  { code: 'KITCHEN_STAFF', name: 'Nhân viên Bếp' },
  { code: 'INVENTORY_STAFF', name: 'Nhân viên Kho' },
];

const permissionDefinitions = [
  ['auth:me', 'Xem thông tin tài khoản', 'auth'],
  ['users:read', 'Xem người dùng', 'users'],
  ['users:create', 'Tạo người dùng', 'users'],
  ['users:update', 'Cập nhật người dùng', 'users'],
  ['users:manage-role', 'Quản lý vai trò', 'users'],
  ['menu:read', 'Xem thực đơn', 'menu'],
  ['menu:manage', 'Quản lý thực đơn', 'menu'],
  ['tables:read', 'Xem bàn', 'tables'],
  ['tables:manage', 'Quản lý bàn', 'tables'],
  ['sessions:open', 'Mở phiên bàn', 'sessions'],
  ['sessions:close', 'Đóng phiên bàn', 'sessions'],
  ['orders:read', 'Xem đơn hàng', 'orders'],
  ['orders:create-item', 'Thêm món vào đơn', 'orders'],
  ['orders:manage-item', 'Quản lý món trong đơn', 'orders'],
  ['kitchen:read', 'Xem hàng đợi bếp', 'kitchen'],
  ['kitchen:update-item', 'Cập nhật trạng thái món', 'kitchen'],
  ['inventory:read', 'Xem kho', 'inventory'],
  ['inventory:manage', 'Quản lý kho', 'inventory'],
  ['inventory:count', 'Kiểm kê kho', 'inventory'],
  ['payments:read', 'Xem thanh toán', 'payments'],
  ['payments:confirm', 'Xác nhận thanh toán', 'payments'],
  ['reports:read', 'Xem báo cáo', 'reports'],
  ['audit:read', 'Xem nhật ký hệ thống', 'audit'],
] as const;

const rolePermissions: Record<string, string[]> = {
  MANAGER: permissionDefinitions.map(([code]) => code),
  ORDER_STAFF: [
    'auth:me',
    'menu:read',
    'tables:read',
    'sessions:open',
    'orders:read',
    'orders:create-item',
    'orders:manage-item',
    'payments:read',
    'payments:confirm',
  ],
  KITCHEN_STAFF: [
    'auth:me',
    'menu:read',
    'kitchen:read',
    'kitchen:update-item',
  ],
  INVENTORY_STAFF: [
    'auth:me',
    'inventory:read',
    'inventory:manage',
    'inventory:count',
  ],
};

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const username = process.env.INITIAL_ADMIN_USERNAME?.trim();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const fullName = process.env.INITIAL_ADMIN_FULL_NAME?.trim();
  const employeeCode = process.env.INITIAL_ADMIN_EMPLOYEE_CODE?.trim();

  if (!databaseUrl || !username || !password || !fullName || !employeeCode) {
    throw new Error(
      'Required env: DATABASE_URL, INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_FULL_NAME, INITIAL_ADMIN_EMPLOYEE_CODE',
    );
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
      if (!roleId) throw new Error(`Missing role definition: ${roleCode}`);

      for (const code of codes) {
        const permissionId = permissions.get(code);
        if (!permissionId) throw new Error(`Missing permission: ${code}`);

        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId, permissionId },
          },
          update: {},
          create: { roleId, permissionId },
        });
      }
    }

    const managerRoleId = roles.get('MANAGER');
    if (!managerRoleId) throw new Error('MANAGER role was not seeded');

    const passwordHash = await bcrypt.hash(password, 12);
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true, roleId: true },
    });

    let userId: bigint;
    if (existingUser) {
      if (existingUser.roleId !== managerRoleId) {
        throw new Error(
          'INITIAL_ADMIN_USERNAME already exists but is not assigned to MANAGER; resolve it manually before seeding.',
        );
      }
      userId = existingUser.id;
    } else {
      const user = await prisma.user.create({
        data: {
          username,
          passwordHash,
          roleId: managerRoleId,
          isActive: true,
        },
        select: { id: true },
      });
      userId = user.id;
    }

    await prisma.employee.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        employeeCode,
        fullName,
      },
    });

    console.log('ResMan roles, permissions and initial manager are ready.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
