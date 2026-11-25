import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export const MENU_PRICING_TYPES = ["FIXED", "PER_UNIT", "MARKET_PRICE", "UNSET"] as const;
export type MenuPricingType = (typeof MENU_PRICING_TYPES)[number];

export class CreateMenuItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  code!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId!: number;

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
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
