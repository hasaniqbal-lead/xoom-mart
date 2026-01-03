import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';
import { ShopsModule } from './shops/shops.module';
import { RidersModule } from './riders/riders.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ConfigModule } from './config/config.module';
import { UploadModule } from './upload/upload.module';
import { HomeModule } from './home/home.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    AuthModule,
    CatalogModule,
    OrdersModule,
    ShopsModule,
    RidersModule,
    PromotionsModule,
    ConfigModule,
    UploadModule,
    HomeModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
