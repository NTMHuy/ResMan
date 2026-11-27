import { IsIn } from "class-validator";

export class UpdateUserRoleDto {
  @IsIn(["ORDER_STAFF", "KITCHEN_STAFF", "INVENTORY_STAFF"])
  roleCode!: string;
}
