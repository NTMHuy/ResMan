import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const permissionDefinitions = [
  { code: "menu.category.read", name: "Xem danh mục", module: "menu" },
  { code: "menu.item.read", name: "Xem món ăn", module: "menu" },
] as const;

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Thiếu DATABASE_URL trong backend/.env");

  const pool = new Pool({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const role = await prisma.role.findUnique({
      where: { code: "ORDER_STAFF" },
      select: { id: true },
    });
    if (!role) {
      throw new Error("Không tìm thấy role ORDER_STAFF. Hãy khởi tạo roles và permissions trước.");
    }

    for (const definition of permissionDefinitions) {
      const permission = await prisma.permission.upsert({
        where: { code: definition.code },
        update: { name: definition.name, module: definition.module },
        create: definition,
      });
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }

    console.log("Đã cấp quyền chỉ đọc thực đơn cho ORDER_STAFF.");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
