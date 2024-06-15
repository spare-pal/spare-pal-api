import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { BannerModule } from './banner/banner.module'
import { OrderModule } from './order/order.module'
import PrismaModule from './prisma/prisma.module'
import { ProductModule } from './product/product.module'
import { ShopModule } from './shop/shop.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ShopModule,
    BannerModule,
    ProductModule,
    OrderModule,
  ],
})
export default class AppModule {}
