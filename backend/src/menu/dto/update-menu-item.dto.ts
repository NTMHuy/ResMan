import { IsBoolean, IsIn, IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class UpdateMenuItemDto {
  @IsOptional() @IsInt() @Min(1) categoryId?: number;
  @IsOptional() @IsString() @MaxLength(150) name?: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsNumberString() price?: string;
  @IsOptional() @IsString() @MaxLength(1000) imageUrl?: string | null;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsIn(["AVAILABLE", "MANUAL_UNAVAILABLE"]) availabilityStatus?: "AVAILABLE" | "MANUAL_UNAVAILABLE";
  @IsOptional() @IsString() availabilityReason?: string | null;
}
