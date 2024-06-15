import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User } from '../utils/decorators/user.decorator'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { SendOtpDto } from './dto/send-otp.dto'
import { SignInDto } from './dto/sign-in.dto'
import { AuthGuard } from './guards/auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body)
  }

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() { phone_number }: SendOtpDto) {
    return await this.authService.sendOtp(phone_number)
  }

  @Post('sign-up')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.register(body)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User('id') id: number) {
    return this.authService.getProfile(id)
  }
}
