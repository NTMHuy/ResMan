import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: '.env' });

export default defineConfig({
<<<<<<< HEAD:backend/prisma.config.ts
  schema: "../prisma/schema.prisma",
  migrations: {
    path: "../prisma/migrations",
=======
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
>>>>>>> baa2968 (feat(menu): implement menu categories, items, image upload, and search/filter):prisma.config.ts
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});