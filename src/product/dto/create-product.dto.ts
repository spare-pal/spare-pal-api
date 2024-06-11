import { ApiProperty } from '@nestjs/swagger'
import { ProductStatus } from '@prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateProductDto {
  @ApiProperty({
    example: 'Tyre',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'Michelin Tyre for all vehicles.',
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    example: 1000,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number

  @ApiProperty({
    example: 'ACTIVE',
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status: ProductStatus

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  shop_id: number
}
