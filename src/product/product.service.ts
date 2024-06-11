import { Injectable } from '@nestjs/common'
import { ProductStatus } from '@prisma/client'
import { ErrorCustomException } from 'src/utils/exception/error.filter'
import { QueryDto } from 'src/utils/query.dto'
import PrismaService from '../prisma/prisma.service'
import { paginator } from '../utils/paginator'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    try {
      return this.prismaService.product.create({
        data: {
          ...createProductDto,
          status: createProductDto.status ?? ProductStatus.INACTIVE,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'product')
    }
  }

  findAll({ page, items_per_page }: QueryDto) {
    try {
      const paginate = paginator({ items_per_page, page })
      return paginate(
        this.prismaService.product,
        {
          where: {
            status: ProductStatus.ACTIVE,
            deleted_at: null,
          },
          include: {
            Shop: true,
            Images: true,
          },
        },
        { page },
      )
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'product')
    }
  }

  findOne(id: number) {
    try {
      return this.prismaService.product.findUnique({
        where: {
          id,
          status: ProductStatus.ACTIVE,
          deleted_at: null,
        },
        include: {
          Shop: true,
          Images: true,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'product')
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return this.prismaService.product.update({
        where: {
          id,
        },
        data: {
          ...updateProductDto,
          status: updateProductDto.status ?? ProductStatus.INACTIVE,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'product')
    }
  }

  remove(id: number) {
    try {
      return this.prismaService.product.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'product')
    }
  }
}
