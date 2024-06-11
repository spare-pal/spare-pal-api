import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { User } from 'src/utils/decorators/user.decorator'
import { ErrorExceptionFilter } from '../utils/exception/error.filter'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'
import { CustomerGuard } from './guards/customer.guard'

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
@UseFilters(new ErrorExceptionFilter())
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

  @UseGuards(CustomerGuard)
  @Get('profile')
  getProfile(@User('id') id: number) {
    return this.authService.getProfile(id)
  }
}
