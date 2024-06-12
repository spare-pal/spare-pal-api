import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { QueryDto } from 'src/utils/query.dto'
import { CreateShopDto } from './dto/create-shop.dto'
import { UpdateShopDto } from './dto/update-shop.dto'
import { ShopService } from './shop.service'

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto)
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.shopService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(+id, updateShopDto)
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.shopService.remove(+id)
  }
}
