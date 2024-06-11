import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User } from 'src/utils/decorators/user.decorator'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'
import { CustomerGuard } from './guards/customer.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() request: SignInDto) {
    return this.authService.signIn(request)
  }

  @Post('sign-up')
  signUp(@Body() request: CreateUserDto) {
    return this.authService.register(request)
  }

  @ApiBearerAuth()
  @UseGuards(CustomerGuard)
  @Get('profile')
  getProfile(@User('id') id: number) {
    return this.authService.getProfile(id)
  }
}
