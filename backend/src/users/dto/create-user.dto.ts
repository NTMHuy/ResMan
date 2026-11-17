import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString() @MinLength(3) @MaxLength(80) username!: string;
  @IsString() @MinLength(12) @MaxLength(100) password!: string;
  @IsOptional() @IsEmail() @MaxLength(255) email?: string;
  @IsIn(["ORDER_STAFF", "KITCHEN_STAFF", "INVENTORY_STAFF"]) roleCode!: string;
  @IsString() @MinLength(2) @MaxLength(30) employeeCode!: string;
  @IsString() @MinLength(2) @MaxLength(150) fullName!: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
}
