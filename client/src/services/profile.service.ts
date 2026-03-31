// services/profile.service.ts
import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

export const getUserProfileAPI = () =>
  api.get(ENDPOINTS.USER.PROFILE);

export const updateUserProfileAPI = (data: any) =>
  api.put(ENDPOINTS.USER.UPDATE_PROFILE, data);