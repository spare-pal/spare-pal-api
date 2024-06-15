import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator'

export class SignInDto {
  @ApiProperty({
    example: 'string',
  })
  @Matches(/(0|\+251)9[0-9]{8}/, {
    message: 'Please provide a valid phone number (09XXXXXXXX)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const val = value.trim()
    if (val.startsWith('0')) {
      return `+251${val.slice(1)}`
    }
  })
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
