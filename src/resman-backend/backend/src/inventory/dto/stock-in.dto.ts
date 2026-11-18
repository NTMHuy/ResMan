import { IsOptional, IsString, MaxLength, Matches } from "class-validator";

export class StockInDto {
  @Matches(/^[0-9]+(\.\d{1,3})?$/)
  quantity!: string;

  @IsString()
  @MaxLength(500)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  referenceCode?: string;
}
