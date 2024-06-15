import { PartialType, PickType } from '@nestjs/swagger'
import { SignInDto } from './sign-in.dto'

export class SendOtpDto extends PartialType(
  PickType(SignInDto, ['phone_number'] as const),
) {}
