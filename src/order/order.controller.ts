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
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderService } from './order.service'
import { QueryDto } from 'src/utils/query.dto'
import { User } from 'src/utils/decorators/user.decorator'

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
  findAll(@Query() query: QueryDto) {
    return this.orderService.findAll(query)
  }

  @Get('mine')
  findUserOrders(@User('id') user_id: number, @Query() query: QueryDto) {
    return this.orderService.findUserOrders(user_id, query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id)
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
