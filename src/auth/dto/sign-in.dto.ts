import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator'

export class SignInDto {
  @ApiProperty({
    example: '0912121212',
  })
  @Matches(/^(0|251|\+251)9\d{8}$/, {
    message: 'Please provide a valid phone number (09XXXXXXXX)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const val = value.trim()
    if (val.startsWith('0')) {
      return `+251${val.slice(1)}`
    }
    if (val.startsWith('251')) {
      return `+${val}`
    }
    return val
  })
  phone_number: string

  @ApiProperty({
    example: 'string',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: 'ADMIN',
    enum: ['ADMIN', 'CUSTOMER'],
  })
  @IsEnum(['ADMIN', 'CUSTOMER'])
  @IsNotEmpty()
  role: 'ADMIN' | 'CUSTOMER'
}
