import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

export interface CreateRatingPayload {
  dealId: string;
  rating: number;
  review?: string;
  categories?: {
    communication?: number;
    productQuality?: number;
    delivery?: number;
    pricing?: number;
    professionalism?: number;
  };
  isAnonymous?: boolean;
}

export const createRatingAPI = (userId: string, data: CreateRatingPayload) =>
  api.post(ENDPOINTS.RATINGS.CREATE(userId), data);

export const getRatingsByUserAPI = (userId: string) =>
  api.get(ENDPOINTS.RATINGS.GET_BY_USER(userId));

export const getMyRatingsAPI = () =>
  api.get(ENDPOINTS.RATINGS.GET_MY_RATINGS);