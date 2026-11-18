import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateMenuCategoryDto {
  @IsString() @MaxLength(40) code!: string;
  @IsString() @MaxLength(100) name!: string;
  @IsOptional() @IsString() description?: string | null;
}
