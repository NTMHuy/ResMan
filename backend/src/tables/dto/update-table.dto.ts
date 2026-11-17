import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateTableDto {
  @IsOptional() @IsString() @MaxLength(30) code?: string;
  @IsOptional() @IsString() @MaxLength(80) name?: string;
  @IsOptional() @IsInt() @Min(1) @Max(100) capacity?: number | null;
}
