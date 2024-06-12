import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User as PrismaUser } from '@prisma/client'
import { AdminGuard } from '../auth/guards/admin.guard'
import { AuthGuard } from '../auth/guards/auth.guard'
import { User } from '../utils/decorators/user.decorator'
import { QueryDto } from '../utils/query.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderService } from './order.service'

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @Post()
  create(@User('id') user_id: number, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(user_id, createOrderDto)
  }

  @Get()
  findAll(@User() user: PrismaUser, @Query() query: QueryDto) {
    return this.orderService.findAll(user, query)
  }

  @Get(':id')
  findOne(@User('id') user_id: number, @Param('id') id: string) {
    return this.orderService.findOne(user_id, +id)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto)
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id)
  }
}
