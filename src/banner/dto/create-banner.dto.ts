import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateBannerDto {
  @ApiProperty({
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string

  @ApiProperty({
    example: 'Banner Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    example: 'Banner Description',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    example: true,
  })
  @IsOptional()
  @IsEnum([true, false])
  status: boolean

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  shop_id: number
}
