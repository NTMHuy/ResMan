import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateMenuItemDto {
  @IsString() @MaxLength(40) code!: string;
  @IsInt() @Min(1) categoryId!: number;
  @IsString() @MaxLength(150) name!: string;
  @IsOptional() @IsString() description?: string | null;
  @IsNumberString() price!: string;
  @IsOptional() @IsString() @MaxLength(1000) imageUrl?: string | null;
}
