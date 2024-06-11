import { ApiProperty } from '@nestjs/swagger'
import { ShopStatus } from '@prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateShopDto {
  @ApiProperty({
    example: 'Shop Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'This is a shop',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    example: '123 Main St',
  })
  @IsString()
  @IsOptional()
  address: string

  @ApiProperty({
    example: 123.456,
  })
  @IsNumber()
  @IsOptional()
  latitude: number

  @ApiProperty({
    example: 123.456,
  })
  @IsNumber()
  @IsOptional()
  longitude: number

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  user_id: number

  @ApiProperty({
    example: 'ACTIVE',
  })
  @IsEnum(ShopStatus)
  @IsOptional()
  status: ShopStatus
}
