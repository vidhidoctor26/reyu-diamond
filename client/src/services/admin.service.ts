import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

// Dashboard
export const getAdminStatsAPI = () =>
  api.get(ENDPOINTS.ADMIN.STATS);

// Users
export const getAllUsersAPI = (page = 1, limit = 20) =>
  api.get(ENDPOINTS.ADMIN.USERS, { params: { page, limit } });

export const updateUserStatusAPI = (id: string, isBlocked: boolean) =>
  api.patch(ENDPOINTS.ADMIN.USER_BLOCK(id), { isBlocked });

// KYC
export const getAllKycsAPI = () =>
  api.get(ENDPOINTS.ADMIN.KYC_LIST);

export const verifyKycAPI = (id: string, data: { status: "APPROVED" | "REJECTED"; rejectionReason?: string }) =>
  api.put(ENDPOINTS.ADMIN.KYC_VERIFY(id), data);

// Ads
export const getAllAdsAdminAPI = () =>
  api.get(ENDPOINTS.ADMIN.ADS_LIST);

export const updateAdStatusAdminAPI = (
  adId: string,
  data: { action: "APPROVE" | "REJECT" | "DISABLE"; rejectionReason?: string }
) => api.patch(ENDPOINTS.ADMIN.AD_STATUS(adId), data);

// Deals
export const getAllDealsAdminAPI = () =>
  api.get(ENDPOINTS.ADMIN.DEALS_LIST);

export const resolveDisputeAPI = (
  id: string,
  data: { resolution: "REFUND_BUYER" | "RELEASE_SELLER"; adminNote: string }
) => api.patch(ENDPOINTS.ADMIN.DEAL_RESOLVE(id), data);

// Auctions
export const getAllAuctionsAdminAPI = () =>
  api.get(ENDPOINTS.ADMIN.AUCTIONS_LIST);