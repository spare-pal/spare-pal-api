import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'
import PrismaService from 'src/prisma/prisma.service'
import { ErrorCustomException } from 'src/utils/exception/error.filter'
import { SignInDto } from './dto/sign-in.dto'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async register(request: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...request,
          username: request.phone_number,
          password: await argon.hash(request.password),
        },
      })

      return user
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'user')
    }
  }

  async signIn(request: SignInDto) {
    let user = null
    try {
      user = await this.prismaService.user.findFirstOrThrow({
        where: { phone_number: request.phone_number },
      })
    } catch (error) {
      console.error(error)
      throw new ErrorCustomException(
        'INVALID_CREDENTIALS',
        HttpStatus.UNAUTHORIZED,
      )
    }
    const passwordMatches = await argon.verify(user.password, request.password)
    if (!passwordMatches) {
      throw new ErrorCustomException(
        'INVALID_CREDENTIALS',
        HttpStatus.UNAUTHORIZED,
      )
    }
    if (user.status !== 'ACTIVE') {
      throw new ErrorCustomException(
        'Your account is not active',
        HttpStatus.UNAUTHORIZED,
      )
    }
    const token = await this.signToken({
      sub: user.id,
    })
    return { ...token }
  }

  async signToken(payload: {
    sub: number | string
    isRetail?: boolean
  }): Promise<{ accessToken: string }> {
    const token = await this.jwt.signAsync(payload, {
      expiresIn: `${this.configService.get('JWT_TTL')}m`,
      secret: this.configService.get('JWT_SECRET'),
    })

    return {
      accessToken: token,
    }
  }

  async getProfile(userId: number) {
    return await this.prismaService.user.findFirstOrThrow({
      where: { id: userId },
    })
  }
}
