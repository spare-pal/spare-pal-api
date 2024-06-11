import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
  })
  @Matches(RegExp('^[a-zA-Z ]+$'))
  @IsString()
  @IsNotEmpty()
  first_name: string

  @ApiProperty({
    example: 'Doe',
  })
  @Matches(RegExp('^[a-zA-Z0-9_-]{3,30}$'))
  @IsString()
  @IsOptional()
  last_name: string

  @ApiProperty({
    example: '+251912121212',
  })
  @Matches(/\+?[1-9]\d{1,14}/)
  @IsString()
  @IsNotEmpty()
  phone_number: string

  @ApiProperty({
    example: 'john@mail.com',
  })
  @IsEmail()
  @IsOptional()
  email: string

  @ApiProperty({
    example: 'Password123',
  })
  @Matches(RegExp('^.{3,}$'))
  @IsString()
  @IsNotEmpty()
  password: string
}
