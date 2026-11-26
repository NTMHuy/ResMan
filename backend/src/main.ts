import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";

import { AppModule } from "./app.module.js";
import {
  UPLOAD_DIRECTORY,
  ensureMenuItemsUploadDirectory,
} from "./common/utils/menu-image-storage.js";

async function bootstrap(): Promise<void> {
  ensureMenuItemsUploadDirectory();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api/v1");

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );

  // Static image URLs intentionally stay outside the /api/v1 prefix.
  app.useStaticAssets(UPLOAD_DIRECTORY, {
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
