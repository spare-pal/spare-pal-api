import { Injectable } from '@nestjs/common'
import { ShopStatus } from '@prisma/client'
import PrismaService from '../prisma/prisma.service'
import { ErrorCustomException } from '../utils/exception/error.filter'
import { paginator } from '../utils/paginator'
import { QueryDto } from '../utils/query.dto'
import { CreateShopDto } from './dto/create-shop.dto'
import { UpdateShopDto } from './dto/update-shop.dto'

@Injectable()
export class ShopService {
  constructor(private prismaService: PrismaService) {}

  create(createShopDto: CreateShopDto) {
    try {
      return this.prismaService.shop.create({
        data: {
          ...createShopDto,
          status: createShopDto.status ?? ShopStatus.INACTIVE,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'shop')
    }
  }

  findAll({ page, items_per_page }: QueryDto) {
    try {
      const paginate = paginator({ items_per_page, page })
      return paginate(
        this.prismaService.shop,
        {
          where: {
            status: ShopStatus.ACTIVE,
            deleted_at: null,
          },
        },
        { page },
      )
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'shop')
    }
  }

  findOne(id: number) {
    try {
      return this.prismaService.shop.findUnique({
        where: {
          id,
          status: ShopStatus.ACTIVE,
          deleted_at: null,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'shop')
    }
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    try {
      return this.prismaService.shop.update({
        where: {
          id,
        },
        data: {
          ...updateShopDto,
          status: updateShopDto.status ?? ShopStatus.INACTIVE,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'shop')
    }
  }

  remove(id: number) {
    try {
      return this.prismaService.shop.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'shop')
    }
  }
}
