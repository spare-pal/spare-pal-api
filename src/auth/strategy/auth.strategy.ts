import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import PrismaService from '../../prisma/prisma.service'
import { CustomException } from '../../utils/exception/error.filter'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: { sub: number; email: string }) {
    try {
      return await this.prismaService.user.findFirstOrThrow({
        where: { email: payload.email },
      })
    } catch (exception) {
      CustomException.handle(exception, 'user')
    }
  }
}
