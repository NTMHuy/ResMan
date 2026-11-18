import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateMenuCategoryDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
