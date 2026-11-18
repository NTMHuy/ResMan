import { IsOptional, IsString, MaxLength, Matches } from "class-validator";

export class CreateIngredientDto {
  @IsString()
  @MaxLength(40)
  @Matches(/^[A-Za-z0-9_-]+$/)
  code!: string;

  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsString()
  @MaxLength(30)
  unit!: string;

  @IsOptional()
  @Matches(/^\d+(\.\d{1,3})?$/)
  lowStockThreshold?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
