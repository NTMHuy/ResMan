import { Type } from "class-transformer";
import { IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdateCustomerAccountDto {
  @IsOptional() @IsString() @MinLength(3) @MaxLength(80) username?: string;
  @IsOptional() @IsString() @MinLength(12) @MaxLength(100) password?: string;
  @IsOptional() @IsEmail() @MaxLength(255) email?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) deviceCode?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) deviceName?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) tableId?: number;
}
