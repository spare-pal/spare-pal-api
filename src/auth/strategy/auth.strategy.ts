import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import PrismaService from 'src/prisma/prisma.service'
import { ErrorCustomException } from 'src/utils/exception/error.filter'

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
      ErrorCustomException.handle(exception, 'user')
    }
  }
}
