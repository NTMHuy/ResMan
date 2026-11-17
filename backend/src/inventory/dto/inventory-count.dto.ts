import { IsOptional, IsString, MaxLength, Matches } from "class-validator";

export class InventoryCountDto {
  @Matches(/^[0-9]+(\.\d{1,3})?$/)
  actualQuantity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
