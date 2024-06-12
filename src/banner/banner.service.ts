import { Injectable } from '@nestjs/common'
import PrismaService from '../prisma/prisma.service'
import { ErrorCustomException } from '../utils/exception/error.filter'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Injectable()
export class BannerService {
  constructor(private prismaService: PrismaService) {}

  create(createBannerDto: CreateBannerDto) {
    try {
      return this.prismaService.banner.create({
        data: createBannerDto,
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'banner')
    }
  }

  async findAll() {
    try {
      return await this.prismaService.banner.findMany({
        where: {
          status: true,
          deleted_at: null,
        },
        include: {
          Shop: true,
        },
        take: 10,
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'banner')
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.banner.findUniqueOrThrow({
        where: {
          id,
          deleted_at: null,
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'banner')
    }
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    try {
      return this.prismaService.banner.update({
        where: {
          id,
        },
        data: updateBannerDto,
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'banner')
    }
  }

  remove(id: number) {
    try {
      return this.prismaService.banner.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      })
    } catch (error) {
      console.error(error)
      ErrorCustomException.handle(error, 'banner')
    }
  }
}
