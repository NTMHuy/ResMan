import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateKitchenItemStatusDto {
  @IsIn(["ACCEPTED", "IN_PREPARATION", "COMPLETED", "CANCELLED"])
  status!: "ACCEPTED" | "IN_PREPARATION" | "COMPLETED" | "CANCELLED";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
