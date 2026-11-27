import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateOrderItemsStatusDto {
  @IsIn(["ACCEPTED", "IN_PREPARATION", "COMPLETED", "CANCELLED"])
  status!: "ACCEPTED" | "IN_PREPARATION" | "COMPLETED" | "CANCELLED";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
