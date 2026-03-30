import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateAdPayload, BannerSection } from "@/services/advertisement.service";

export type AdStatus      = "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";
export type MediaType     = "image" | "video";

export interface Advertisement {
  _id: string;
  advertiserId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: MediaType;
  ctaLink?: string;
  bannerSection: BannerSection[];
  status: AdStatus;
  rejectionReason?: string;
  startDate?: string;
  endDate?: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

interface AdvertisementState {
  // my ads
  myAds: Advertisement[];
  myAdsLoading: boolean;
  myAdsError: string | null;

  // single ad
  selectedAd: Advertisement | null;
  selectedAdLoading: boolean;
  selectedAdError: string | null;

  // active / public ads
  activeAds: Advertisement[];
  activeAdsLoading: boolean;
  activeAdsError: string | null;

  // create
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
}

const initialState: AdvertisementState = {
  myAds: [],
  myAdsLoading: false,
  myAdsError: null,

  selectedAd: null,
  selectedAdLoading: false,
  selectedAdError: null,

  activeAds: [],
  activeAdsLoading: false,
  activeAdsError: null,

  createLoading: false,
  createError: null,
  createSuccess: false,
};

const advertisementSlice = createSlice({
  name: "advertisement",
  initialState,
  reducers: {
    // ── Fetch My Ads ──────────────────────────────────────────
    fetchMyAdsRequest(state) {
      state.myAdsLoading = true;
      state.myAdsError   = null;
    },
    fetchMyAdsSuccess(state, action: PayloadAction<Advertisement[]>) {
      state.myAdsLoading = false;
      state.myAds        = action.payload;
    },
    fetchMyAdsFailure(state, action: PayloadAction<string>) {
      state.myAdsLoading = false;
      state.myAdsError   = action.payload;
    },

    // ── Fetch Ad By Id ────────────────────────────────────────
    fetchAdByIdRequest(state, _action: PayloadAction<string>) {
      state.selectedAdLoading = true;
      state.selectedAdError   = null;
    },
    fetchAdByIdSuccess(state, action: PayloadAction<Advertisement>) {
      state.selectedAdLoading = false;
      state.selectedAd        = action.payload;
    },
    fetchAdByIdFailure(state, action: PayloadAction<string>) {
      state.selectedAdLoading = false;
      state.selectedAdError   = action.payload;
    },

    // ── Fetch Active Ads ──────────────────────────────────────
    fetchActiveAdsRequest(state, _action: PayloadAction<BannerSection | undefined>) {
      state.activeAdsLoading = true;
      state.activeAdsError   = null;
    },
    fetchActiveAdsSuccess(state, action: PayloadAction<Advertisement[]>) {
      state.activeAdsLoading = false;
      state.activeAds        = action.payload;
    },
    fetchActiveAdsFailure(state, action: PayloadAction<string>) {
      state.activeAdsLoading = false;
      state.activeAdsError   = action.payload;
    },

    // ── Create Ad ─────────────────────────────────────────────
    createAdRequest(state, _action: PayloadAction<CreateAdPayload>) {
      state.createLoading = true;
      state.createError   = null;
      state.createSuccess = false;
    },
    createAdSuccess(state, action: PayloadAction<Advertisement>) {
      state.createLoading = false;
      state.createSuccess = true;
      state.myAds.unshift(action.payload);
    },
    createAdFailure(state, action: PayloadAction<string>) {
      state.createLoading = false;
      state.createError   = action.payload;
    },

    // ── Reset helpers ─────────────────────────────────────────
    resetCreateState(state) {
      state.createLoading = false;
      state.createError   = null;
      state.createSuccess = false;
    },
    clearSelectedAd(state) {
      state.selectedAd      = null;
      state.selectedAdError = null;
    },
  },
});

export const {
  fetchMyAdsRequest,
  fetchMyAdsSuccess,
  fetchMyAdsFailure,
  fetchAdByIdRequest,
  fetchAdByIdSuccess,
  fetchAdByIdFailure,
  fetchActiveAdsRequest,
  fetchActiveAdsSuccess,
  fetchActiveAdsFailure,
  createAdRequest,
  createAdSuccess,
  createAdFailure,
  resetCreateState,
  clearSelectedAd,
} = advertisementSlice.actions;

export default advertisementSlice.reducer;