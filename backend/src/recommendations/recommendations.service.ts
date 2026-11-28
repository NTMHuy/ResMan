import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../database/prisma.service.js";
import { AI_TO_RESMAN_CODE, RESMAN_CODE_TO_AI } from "./ai-menu-mapping.js";
import { RecommendationRequestDto } from "./dto/recommendation-request.dto.js";

interface AiRecommendation {
  menu_item_id: string;
  name: string;
  score: number;
  matched_count: number;
  reasons: string[];
}

interface AiRecommendationResponse {
  recommendations: AiRecommendation[];
  note: string | null;
  profile: Record<string, unknown>;
}

@Injectable()
export class RecommendationsService {
  private readonly aiBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.aiBaseUrl = (config.get<string>("RECOMMENDATION_SERVICE_URL") ?? "http://127.0.0.1:8000")
      .replace(/\/$/, "");
  }

  async getSurveyQuestions() {
    const response = await this.requestAi("/survey/questions", { method: "GET" });
    return response;
  }

  async recommendForCustomer(userId: string, request: RecommendationRequestDto) {
    const userIdBigInt = BigInt(userId);
    const device = await this.prisma.tableDevice.findUnique({
      where: { userId: userIdBigInt },
      select: { diningTableId: true, isActive: true },
    });

    if (!device || !device.isActive) {
      throw new NotFoundException("Tài khoản khách hàng chưa được gán với tablet đang hoạt động");
    }

    const activeSession = await this.prisma.diningSession.findFirst({
      where: { tableId: device.diningTableId, status: "OPEN" },
      select: {
        order: {
          select: {
            items: {
              where: { status: { not: "CANCELLED" } },
              select: { quantity: true, menuItem: { select: { code: true } } },
            },
          },
        },
      },
    });

    const orderedItems = (activeSession?.order?.items ?? [])
      .map((item) => ({
        menu_item_id: RESMAN_CODE_TO_AI[item.menuItem.code],
        quantity: item.quantity,
      }))
      .filter((item): item is { menu_item_id: string; quantity: number } => Boolean(item.menu_item_id));

    if (orderedItems.length === 0 && !request.survey) {
      throw new NotFoundException("Phiên bàn chưa có món đã gọi. Vui lòng gửi khảo sát để nhận gợi ý.");
    }

    const aiResult = await this.requestAi("/recommend", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ordered_items: orderedItems,
        survey: request.survey,
        k: request.k,
      }),
    }) as AiRecommendationResponse;

    const ranked = (aiResult.recommendations ?? [])
      .filter((item) => typeof item.menu_item_id === "string" && AI_TO_RESMAN_CODE[item.menu_item_id])
      .map((item) => ({
        ...item,
        resmanCode: AI_TO_RESMAN_CODE[item.menu_item_id],
      }));

    if (ranked.length === 0) {
      return {
        items: [],
        available: false,
        message: aiResult.note ?? "Chưa có món phù hợp để gợi ý.",
        profile: aiResult.profile ?? {},
      };
    }

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        code: { in: ranked.map((item) => item.resmanCode) },
        isActive: true,
        availabilityStatus: "AVAILABLE",
        category: { isActive: true },
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        price: true,
        pricingType: true,
        priceUnit: true,
        imageUrl: true,
        category: { select: { id: true, code: true, name: true } },
      },
    });

    const byCode = new Map(menuItems.map((item) => [item.code, item]));
    const items = ranked.flatMap((recommendation) => {
      const item = byCode.get(recommendation.resmanCode);
      if (!item) return [];
      return [{
        id: item.id.toString(),
        code: item.code,
        name: item.name,
        description: item.description,
        price: item.price?.toString() ?? null,
        pricingType: item.pricingType,
        priceUnit: item.priceUnit,
        imageUrl: item.imageUrl,
        category: {
          id: item.category.id.toString(),
          code: item.category.code,
          name: item.category.name,
        },
        recommendation: {
          score: recommendation.score,
          reasons: recommendation.reasons,
        },
      }];
    });

    return {
      items,
      available: items.length > 0,
      message: aiResult.note ?? (items.length > 0 ? "Gợi ý món ăn dành cho bàn của bạn." : "Các món phù hợp hiện không còn khả dụng."),
      profile: aiResult.profile ?? {},
    };
  }

  private async requestAi(path: string, init: RequestInit) {
    let response: Response;
    try {
      response = await fetch(`${this.aiBaseUrl}${path}`, {
        ...init,
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new ServiceUnavailableException("Dịch vụ AI Recommendation hiện không phản hồi");
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const detail = payload && typeof payload.detail === "string"
        ? payload.detail
        : "Dịch vụ AI Recommendation trả về lỗi";
      throw new ServiceUnavailableException(detail);
    }
    return payload;
  }
}
