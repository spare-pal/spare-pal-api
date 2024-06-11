import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import PrismaService from '../prisma/prisma.service'
import { ErrorCustomException } from 'src/utils/exception/error.filter'
import { paginator } from '../utils/paginator'
import { QueryDto } from 'src/utils/query.dto'

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    try {
      return this.prismaService.product.create({
        data: createProductDto,
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'product')
    }
  }

  findAll(request: QueryDto) {
    try {
      const paginate = paginator({
        items_per_page: request.items_per_page,
        page: request.page,
      })
      return paginate(
        this.prismaService.product,
        {
          where: {
            deleted_at: null,
          },
          include: {
            Shop: true,
          },
        },
        {
          page: request.page,
        },
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
        },
        include: {
          Shop: true,
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
        data: updateProductDto,
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
