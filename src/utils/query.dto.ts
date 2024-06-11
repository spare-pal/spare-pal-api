import { Transform } from 'class-transformer'
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator'

export class QueryDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page?: number

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  items_per_page?: number

  @IsString()
  @IsOptional()
  sort?: string

  @IsIn(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc'
}
