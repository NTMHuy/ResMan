import { IsOptional, IsString, MaxLength } from 'class-validator';

export class OpenSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
