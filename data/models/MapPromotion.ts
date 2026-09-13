export type PromotionType = "FEATURED" | "PREMIUM" | "SPONSORED";

export type PromotionStatus = "ACTIVE" | "PAUSED" | "EXPIRED";

export interface MapPromotion {
  id: string;
  place_id: string;

  type: PromotionType;
  status: PromotionStatus;

  priority: number;

  start_at: string;
  end_at: string | null;

  created_at: string;
  updated_at: string;
}
