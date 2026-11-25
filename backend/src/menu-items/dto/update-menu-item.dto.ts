import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { MENU_PRICING_TYPES, type MenuPricingType } from "./create-menu-item.dto.js";

export class UpdateMenuItemDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  code?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @IsOptional()
  @Transform(({ value }) => value === null ? null : Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number | null;

  @IsOptional()
  @IsIn(MENU_PRICING_TYPES)
  pricingType?: MenuPricingType;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  priceUnit?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  availabilityStatus?: string;

  @IsOptional()
  @IsString()
  availabilityReason?: string | null;
}
