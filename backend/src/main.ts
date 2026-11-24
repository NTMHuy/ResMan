import "dotenv/config";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";

import helmet from "helmet";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const uploadDirectory = resolve(process.cwd(), "uploads");
  const menuImageDirectory = resolve(uploadDirectory, "menu-items");

  mkdirSync(menuImageDirectory, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api/v1");

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );

  app.useStaticAssets(uploadDirectory, {
    prefix: "/uploads/",
    index: false,
    dotfiles: "deny",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origins = (
    process.env.FRONTEND_ORIGIN ??
    "http://localhost:8081,http://127.0.0.1:8081,http://localhost:3000,http://localhost:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Session-Code"],
  });

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port);

  console.log(`ResMan API running at http://localhost:${port}/api/v1`);
  console.log(`Menu images served from http://localhost:${port}/uploads/`);
}

void bootstrap();
