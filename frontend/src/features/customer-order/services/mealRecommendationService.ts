import type { MenuItem } from '@/src/features/menu/types/menu.types';

export interface MealRecommendationRequest {
  menuItems: MenuItem[];
  selectedCategoryId: string | null;
  searchKeyword: string;
}

export interface MealRecommendationResult {
  items: MenuItem[];
  message: string;
  available: boolean;
}

export interface MealRecommendationService {
  getRecommendations(request: MealRecommendationRequest): Promise<MealRecommendationResult>;
}

/**
 * Placeholder provider: deliberately returns no fabricated recommendations.
 * Replace this implementation with an AI-backed provider when the model/API is ready.
 */
export const mealRecommendationService: MealRecommendationService = {
  async getRecommendations(_request) {
    return {
      items: [],
      available: false,
      message: 'Gợi ý món ăn thông minh sẽ xuất hiện tại đây khi hệ thống được kết nối AI.',
    };
  },
};
