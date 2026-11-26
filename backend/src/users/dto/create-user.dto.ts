import { Type } from "class-transformer";
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString() @MinLength(3) @MaxLength(80) username!: string;
  @IsString() @MinLength(12) @MaxLength(100) password!: string;
  @IsOptional() @IsEmail() @MaxLength(255) email?: string;
  @IsIn(["ORDER_STAFF", "KITCHEN_STAFF", "INVENTORY_STAFF", "CUSTOMER"])
  roleCode!: string;

  // Required for employee accounts; not used for CUSTOMER accounts.
  @IsOptional() @IsString() @MinLength(2) @MaxLength(30) employeeCode?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(150) fullName?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;

  // Required for CUSTOMER accounts: one customer account is assigned to one table.
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) tableId?: number;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) deviceCode?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) deviceName?: string;
}
