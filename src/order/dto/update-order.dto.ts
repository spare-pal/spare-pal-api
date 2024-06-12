import { PartialType } from '@nestjs/swagger'
import { CreateOrderDto } from './create-order.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { OrderStatus } from '@prisma/client'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    example: OrderStatus.PROCESSING,
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus
}
