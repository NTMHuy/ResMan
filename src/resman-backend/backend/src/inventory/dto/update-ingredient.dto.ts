import { IsBoolean, IsOptional, IsString, MaxLength, Matches } from "class-validator";

export class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  unit?: string;

  @IsOptional()
  @Matches(/^\d+(\.\d{1,3})?$/)
  lowStockThreshold?: string | null;

  @IsOptional()
  @IsString()
  note?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
