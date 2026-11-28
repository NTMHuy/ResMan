import type { MenuItem } from '@/src/features/menu/types/menu.types';
import { resolveMenuImageUrl } from '@/src/constants/config';
import { apiClient } from '@/src/services/api/apiClient';

export interface MealRecommendationRequest {
  survey?: {
    party_size?: number;
    companions?: 'family' | 'friends';
    wants_drinking?: boolean;
    wants_novelty?: boolean;
    answers?: Record<string, boolean>;
  };
  k?: number;
}

export interface MealRecommendationResult {
  items: MenuItem[];
  message: string;
  available: boolean;
}

interface RecommendationApiItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: string | null;
  pricingType: MenuItem['pricingType'];
  priceUnit: string | null;
  imageUrl: string | null;
  category: { id: string; code: string; name: string };
}

interface RecommendationApiResponse {
  items: RecommendationApiItem[];
  available: boolean;
  message: string;
}

export interface MealRecommendationService {
  getRecommendations(request?: MealRecommendationRequest): Promise<MealRecommendationResult>;
}

export const mealRecommendationService: MealRecommendationService = {
  async getRecommendations(request = {}) {
    const response = await apiClient.post<RecommendationApiResponse>(
      '/recommendations/customer',
      request,
    );
    const payload = response.data;

    const items: MenuItem[] = (payload.items ?? []).map((item) => ({
      id: String(item.id),
      sku: item.code,
      name: item.name,
      description: item.description ?? '',
      price: item.price == null ? 0 : Number(item.price),
      pricingType: item.pricingType ?? 'UNSET',
      priceUnit: item.priceUnit,
      categoryId: String(item.category.id),
      station: 'HOT_KITCHEN',
      imageUrl: resolveMenuImageUrl(item.imageUrl),
      status: 'AVAILABLE',
      modifiers: [],
      linkedIngredientIds: [],
      prepTimeMinutes: 0,
      updatedAt: new Date().toISOString(),
    }));

    return {
      items,
      available: Boolean(payload.available),
      message: payload.message || 'Gợi ý món ăn dành cho bàn của bạn.',
    };
  },
};
