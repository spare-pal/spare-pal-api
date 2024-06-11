import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ProductModule } from './product/product.module';
import { ShopModule } from './shop/shop.module';
import PrismaModule from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProductModule,
    ShopModule,
  ],
})
export default class AppModule {}
