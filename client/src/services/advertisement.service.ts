import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

export type BannerSection = "HOME_DASHBOARD" | "MARKETPLACE" | "BANNER_ZONES";

export interface CreateAdPayload {
  title: string;
  description?: string;
  bannerSection: BannerSection;
  ctaLink?: string;
  startDate?: string;
  endDate?: string;
  media?: File;
}

// POST /advertisements/request  — multipart/form-data
export const requestAdAPI = (payload: CreateAdPayload) => {
  const formData = new FormData();

  formData.append("title", payload.title);

  if (payload.description)  formData.append("description",   payload.description);
  if (payload.ctaLink)      formData.append("ctaLink",        payload.ctaLink);
  if (payload.startDate)    formData.append("startDate",      payload.startDate);
  if (payload.endDate)      formData.append("endDate",        payload.endDate);
  if (payload.media)        formData.append("media",          payload.media);

  // backend expects bannerSection as array — send as repeated field
  formData.append("bannerSection", payload.bannerSection);

  return api.post(ENDPOINTS.ADVERTISEMENTS.REQUEST, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// GET /advertisements/my-ads
export const getMyAdsAPI = () =>
  api.get(ENDPOINTS.ADVERTISEMENTS.MY_ADS);

// GET /advertisements/:adId
export const getAdByIdAPI = (adId: string) =>
  api.get(ENDPOINTS.ADVERTISEMENTS.GET_ONE(adId));

// GET /advertisements?section=HOME_DASHBOARD
export const getActiveAdsAPI = (section?: BannerSection) =>
  api.get(ENDPOINTS.ADVERTISEMENTS.ACTIVE, {
    params: section ? { section } : {},
  });