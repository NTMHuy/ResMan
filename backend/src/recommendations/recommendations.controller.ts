import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { RecommendationRequestDto } from "./dto/recommendation-request.dto.js";
import { RecommendationsService } from "./recommendations.service.js";

@Controller("recommendations/customer")
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions("customer:session:start")
export class RecommendationsController {
  constructor(private readonly recommendations: RecommendationsService) {}

  @Get("survey/questions")
  getSurveyQuestions() {
    return this.recommendations.getSurveyQuestions();
  }

  @Post()
  recommend(
    @CurrentUser() user: { id: string },
    @Body() request: RecommendationRequestDto,
  ) {
    return this.recommendations.recommendForCustomer(user.id, request);
  }
}
