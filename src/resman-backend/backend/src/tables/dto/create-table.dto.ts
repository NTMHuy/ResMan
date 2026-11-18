import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateTableDto {
  @IsString() @MaxLength(30) code!: string;
  @IsString() @MaxLength(80) name!: string;
  @IsOptional() @IsInt() @Min(1) @Max(100) capacity?: number;
}
