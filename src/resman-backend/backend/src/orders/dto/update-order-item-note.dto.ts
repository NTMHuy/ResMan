import { IsString, MaxLength } from "class-validator";

export class UpdateOrderItemNoteDto {
  @IsString()
  @MaxLength(500)
  note!: string;
}
