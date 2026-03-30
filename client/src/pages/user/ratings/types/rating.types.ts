export interface DealRating {
  dealId: string;
  overall: number;
  categories: {
    communication: number;
    productQuality: number;
    delivery: number;
    pricing: number;
    professionalism: number;
  };
  reviewText: string;
  anonymous: boolean;
  submittedAt: string;
}