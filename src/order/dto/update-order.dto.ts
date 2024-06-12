import { ApiProperty, PartialType } from '@nestjs/swagger'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'
import { CreateOrderDto } from './create-order.dto'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    example: OrderStatus.PROCESSING,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  order_status: OrderStatus

  @ApiProperty({
    example: PaymentStatus.PAID,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status: PaymentStatus
}
