import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator'

export class SignInDto {
  @ApiProperty({
    example: 'string',
  })
  @Matches(/\+?[1-9]\d{1,14}/)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  phone_number: string

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: 'CUSTOMER',
  })
  @IsEnum(['ADMIN', 'CUSTOMER'])
  @IsNotEmpty()
  role: 'ADMIN' | 'CUSTOMER'
}
