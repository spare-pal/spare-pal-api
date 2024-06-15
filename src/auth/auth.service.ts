import { HttpService } from '@nestjs/axios'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon from 'argon2'
import PrismaService from '../prisma/prisma.service'
import { CustomException } from '../utils/exception/error.filter'
import { CreateUserDto } from './dto/create-user.dto'
import { SignInDto } from './dto/sign-in.dto'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          username: createUserDto.phone_number,
          password: await argon.hash(createUserDto.password),
        },
      })

      return user
    } catch (error) {
      console.error(error)
      CustomException.handle(error, 'user')
    }
  }

  async signIn(signInDto: SignInDto) {
    let user = null
    try {
      user = await this.prismaService.user.findFirstOrThrow({
        where: { phone_number: signInDto.phone_number },
      })
    } catch (error) {
      console.error(error)
      throw new CustomException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED)
    }
    const passwordMatches = await argon.verify(
      user.password,
      signInDto.password,
    )
    if (!passwordMatches) {
      throw new CustomException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED)
    }
    if (user.status !== 'ACTIVE') {
      throw new CustomException(
        'Your account is not active',
        HttpStatus.UNAUTHORIZED,
      )
    }
    const token = await this.signToken({
      sub: user.id,
    })
    return token
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

  async sendOtp(phone_number: string) {
    try {
      const otp = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, '0')
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { phone_number },
      })

      const env = this.configService.get('NODE_ENVIRONMENT')
      if (env !== 'production') {
        await this.prismaService.user.update({
          where: { id: user.id },
          data: { password: await argon.hash(otp) },
        })
        console.log('OTP:', otp)
        return { message: 'Code sent' }
      }

      if (user.status !== 'ACTIVE') {
        throw new CustomException(
          'Your account is not active',
          HttpStatus.UNAUTHORIZED,
        )
      }
      const url = 'https://sms.yegara.com/api3/send'
      await Promise.all([
        this.prismaService.user.update({
          where: { id: user.id },
          data: { password: await argon.hash(otp) },
        }),
        firstValueFrom(
          this.httpService.post(url, {
            id: this.configService.get('SMS_API_ID'),
            domain: this.configService.get('SMS_API_DOMAIN'),
            to: phone_number,
            otp,
          }),
        ),
      ])

      return { message: 'Code sent' }
    } catch (error) {
      console.error('auth', error)
      CustomException.handle(error, 'user')
    }
  }
}
