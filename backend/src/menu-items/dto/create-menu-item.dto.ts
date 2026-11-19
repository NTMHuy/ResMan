import { Type } from 'class-transformer';

import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @Type(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  code: string;

  @Type(() => String)
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
