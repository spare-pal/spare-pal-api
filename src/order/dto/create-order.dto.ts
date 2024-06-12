import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

export class OrderItemDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  product_id: number

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number
}

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
    example: [
      {
        product_id: 1,
        quantity: 1,
      },
      {
        product_id: 5,
        quantity: 2,
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsArray()
  @IsNotEmpty()
  order_items: OrderItemDto[]

  @ApiProperty({
    example: 'Jl. Raya No. 1',
  })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({
    example: 'Cash',
  })
  @IsString()
  @IsNotEmpty()
  payment_method: string

  @ApiProperty({
    example: 'Note',
  })
  @IsString()
  @IsOptional()
  note: string
}
