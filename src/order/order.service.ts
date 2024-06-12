import { HttpStatus, Injectable } from '@nestjs/common'
import { ProductStatus, User } from '@prisma/client'
import PrismaService from '../prisma/prisma.service'
import { ErrorCustomException } from '../utils/exception/error.filter'
import { paginator } from '../utils/paginator'
import { QueryDto } from '../utils/query.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async create(user_id: number, createOrderDto: CreateOrderDto) {
    let order_id = 0
    try {
      let total_price = 0
      const order = await this.prismaService.order.create({
        data: {
          user_id,
          address: createOrderDto.address,
          payment_method: createOrderDto.payment_method,
          note: createOrderDto.note,
          total_price,
          placed: new Date(),
        },
      })
      order_id = order.id
      const products = await this.prismaService.product.findMany({
        where: {
          id: {
            in: createOrderDto.order_items.map((item) => item.product_id),
          },
          status: ProductStatus.ACTIVE,
        },
      })

      for (const item of createOrderDto.order_items) {
        const product = products.find(
          (product) => product.id === item.product_id,
        )
        if (!product) {
          throw new ErrorCustomException(
            'Product not found',
            HttpStatus.NOT_FOUND,
            'product',
          )
        }
        await this.prismaService.orderItem.create({
          data: {
            user_id,
            order_id: order.id,
            product_id: product.id,
            quantity: item.quantity,
            unit_price: product.price,
            total: product.price * item.quantity,
          },
        })
        total_price += product.price * item.quantity
      }

      return await this.prismaService.order.update({
        where: {
          id: order.id,
        },
        data: {
          total_price,
        },
        include: {
          OrderItems: {
            select: {
              unit_price: true,
              quantity: true,
              total: true,
              Product: {
                select: {
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      })
    } catch (error) {
      console.error(error)
      await this.prismaService.order.delete({
        where: {
          id: order_id,
        },
      })
      ErrorCustomException.handle(error, 'order')
    }
  }

  async findAll(user: User, { items_per_page, page }: QueryDto) {
    try {
      const where = {
        deleted_at: null,
      }
      if (user.user_type == 'CUSTOMER') {
        where['user_id'] = user.id
      }
      const paginate = paginator({ items_per_page, page })
      return await paginate(
        this.prismaService.order,
        {
          where,
          include: {
            User: true,
            OrderItems: true,
          },
        },
        { page },
      )
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'order')
    }
  }

  findOne(user_id: number, id: number) {
    try {
      return this.prismaService.order.findUnique({
        where: {
          id,
          user_id,
          deleted_at: null,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'order')
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      if (updateOrderDto.order_status) {
        updateOrderDto[String(updateOrderDto.order_status).toLowerCase()] =
          new Date()
      }
      return await this.prismaService.order.update({
        where: {
          id,
        },
        data: updateOrderDto,
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'order')
    }
  }

  remove(id: number) {
    try {
      return this.prismaService.order.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'order')
    }
  }
}
