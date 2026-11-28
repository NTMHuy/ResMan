import { Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  Max,
  ValidateNested,
} from "class-validator";

export class RecommendationSurveyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  party_size?: number;

  @IsOptional()
  @IsIn(["family", "friends"])
  companions?: "family" | "friends";

  @IsOptional()
  @IsBoolean()
  wants_drinking?: boolean;

  @IsOptional()
  @IsBoolean()
  wants_novelty?: boolean;

  @IsOptional()
  @IsObject()
  answers?: Record<string, boolean>;
}

export class RecommendationRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => RecommendationSurveyDto)
  survey?: RecommendationSurveyDto;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  k?: number;
}
