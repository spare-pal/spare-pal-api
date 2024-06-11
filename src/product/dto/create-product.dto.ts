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
    example: 'prod1',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'desc1',
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number

  @ApiProperty({
    example: 'https://www.img.com/img.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string

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
