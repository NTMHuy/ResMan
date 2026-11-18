import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class ConfirmPaymentDto {
  @IsOptional()
  @IsString()
  @IsIn(["CASH", "CARD", "BANK_TRANSFER"])
  paymentMethod?: "CASH" | "CARD" | "BANK_TRANSFER";

  @IsOptional()
  @IsString()
  @MaxLength(120)
  transactionRef?: string;
}
