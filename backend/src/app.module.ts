import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { DatabaseModule } from "./database/database.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { TablesModule } from "./tables/tables.module.js";
import { UsersModule } from "./users/users.module.js";
import { SessionsModule } from "./sessions/sessions.module.js";
import { OrdersModule } from "./orders/orders.module.js";
import { MenuModule } from "./menu/menu.module.js";
import { KitchenModule } from "./kitchen/kitchen.module.js";
import { PaymentsModule } from "./payments/payments.module.js";
import { InventoryModule } from "./inventory/inventory.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env", cache: true }),
    DatabaseModule,
    AuthModule,
    TablesModule,
    UsersModule,
    SessionsModule,
    OrdersModule,
    MenuModule,
    KitchenModule,
    PaymentsModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
