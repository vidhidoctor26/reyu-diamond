import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

export const getBadgesByUserAPI = (userId: string) =>
  api.get(ENDPOINTS.BADGES.GET_BY_USER(userId));

export const getMyBadgesAPI = () =>
  api.get(ENDPOINTS.BADGES.GET_MY_BADGES);