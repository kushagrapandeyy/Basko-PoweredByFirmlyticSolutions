import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './inventory/inventory.module';
import { ProductsModule } from './products/products.module';
import { PosModule } from './pos/pos.module';
import { OrdersModule } from './orders/orders.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PrismaService } from './prisma.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProcurementModule } from './procurement/procurement.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { GstModule } from './gst/gst.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PlatformModule } from './platform/platform.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),     // ← Powers @Cron subscription processing
    InventoryModule, 
    ProductsModule,
    PosModule,
    OrdersModule,
    SuppliersModule,
    AdminModule,
    AuthModule,
    ProcurementModule,
    NotificationsModule,
    SubscriptionsModule,
    GstModule,
    AnalyticsModule,             // ← Revenue, inventory health, supplier scorecard
    DeliveryModule,              // ← WebSocket gateway + REST location endpoints
    PlatformModule,              // ← Cross-store search, ONDC catalog
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

