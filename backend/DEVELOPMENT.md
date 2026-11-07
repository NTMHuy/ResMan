# Backend development setup

## Requirements

- Node.js 24 or later
- npm 11 or later
- PostgreSQL 15 or later (a local development database is recommended)

## Install

Run these commands in PowerShell from the repository root:

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `backend/.env` and replace the sample PostgreSQL credentials/database with your local values. Do not commit `.env`.

Then install dependencies and check the Prisma schema:

```powershell
npm install
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
npm run build
```

The Prisma schema is stored at `../prisma/schema.prisma`; the Prisma 7 configuration and migration path are defined in `prisma.config.ts`. Generated Prisma Client files are placed in `src/generated/prisma` and ignored by Git.

## Run the API

```powershell
npm run start:dev
```

Health endpoint:

```text
GET http://localhost:3000/api/v1/health
```

Expected response:

```json
{"status":"ok","service":"resman-backend"}
```

## Database migration

Do not create or apply the initial migration until:

1. `prisma validate` succeeds.
2. The schema has been reviewed against Database Design v3.2.
3. A disposable local PostgreSQL database is available.
4. The team has reviewed unresolved database decisions in `../prisma/migrations/README.md`.

Follow the migration runbook at `../prisma/migrations/README.md`. Never use `prisma db push` as a substitute for versioned migrations.

## Current implementation boundary

This workspace currently contains only the NestJS bootstrap and health endpoint. Business modules, authentication, authorization, database services, and migration SQL have not been implemented.
