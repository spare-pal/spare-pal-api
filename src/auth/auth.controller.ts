import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User } from '../utils/decorators/user.decorator'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'
import { AuthGuard } from './guards/auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body)
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
