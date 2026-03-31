import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AdminKyc {
  _id: string;
  userId: { _id: string; name: string; email: string };
  status: "pending" | "approved" | "rejected";
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  phone: string;
  address: {
    residentialAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  documents: {
    aadhaar: { aadhaarLast4: string; url: string };
    pan: { panLast4: string; url: string };
    selfie?: { url: string };
  };
  rejectionReason?: string;
  createdAt: string;
}

export interface AdminAd {
  _id: string;
  advertiserId: { _id: string; name: string; email: string };
  title: string;
  mediaUrl: string;
  mediaType: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";
  bannerSection: string[];
  clicks: number;
  rejectionReason?: string;
  createdAt: string;
}

export interface AdminDeal {
  _id: string;
  buyerId: { _id: string; name: string; email: string };
  sellerId: { _id: string; name: string; email: string };
  inventoryId: any;
  dealAmount: number;
  status: string;
  dispute?: { reason: string; raisedBy: string; raisedAt: string };
  createdAt: string;
}

export interface AdminAuction {
  _id: string;
  sellerId: { _id: string; name: string; email: string };
  inventoryId: any;
  basePrice: number;
  currentBid: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalDeals: number;
    totalVolume: number;
    averageDealSize: number;
  };
  users: {
    total: number;
    byRole: Record<string, number>;
    recent: AdminUser[];
    growth: { _id: string; count: number }[];
  };
  kyc: {
    stats: Record<string, number>;
    total: number;
  };
  advertisements: {
    stats: Record<string, number>;
    total: number;
  };
  deals: {
    stats: Record<string, number>;
    total: number;
    volume: { total: number; avg: number; max: number; min: number };
    recent: AdminDeal[];
    growth: { _id: string; total: number; count: number }[];
  };
  auctions: {
    stats: Record<string, number>;
    total: number;
  };
  inventory: {
    stats: Record<string, number>;
    total: number;
  };
}

interface AdminState {
  // dashboard
  stats: DashboardStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // users
  users: AdminUser[];
  usersPagination: { total: number; page: number; limit: number; pages: number } | null;
  usersLoading: boolean;
  usersError: string | null;

  // kyc
  kycs: AdminKyc[];
  kycsLoading: boolean;
  kycsError: string | null;

  // ads
  ads: AdminAd[];
  adsLoading: boolean;
  adsError: string | null;

  // deals
  deals: AdminDeal[];
  dealsLoading: boolean;
  dealsError: string | null;

  // auctions
  auctions: AdminAuction[];
  auctionsLoading: boolean;
  auctionsError: string | null;

  // action states
  actionLoading: boolean;
  actionError: string | null;
}

const initialState: AdminState = {
  stats: null,
  statsLoading: false,
  statsError: null,

  users: [],
  usersPagination: null,
  usersLoading: false,
  usersError: null,

  kycs: [],
  kycsLoading: false,
  kycsError: null,

  ads: [],
  adsLoading: false,
  adsError: null,

  deals: [],
  dealsLoading: false,
  dealsError: null,

  auctions: [],
  auctionsLoading: false,
  auctionsError: null,

  actionLoading: false,
  actionError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // ── Dashboard Stats ───────────────────────────────────────
    fetchStatsRequest(state) {
      state.statsLoading = true;
      state.statsError   = null;
    },
    fetchStatsSuccess(state, action: PayloadAction<DashboardStats>) {
      state.statsLoading = false;
      state.stats        = action.payload;
    },
    fetchStatsFailure(state, action: PayloadAction<string>) {
      state.statsLoading = false;
      state.statsError   = action.payload;
    },

    // ── Users ─────────────────────────────────────────────────
    fetchUsersRequest(state, _action: PayloadAction<{ page?: number; limit?: number }>) {
      state.usersLoading = true;
      state.usersError   = null;
    },
    fetchUsersSuccess(state, action: PayloadAction<{ users: AdminUser[]; pagination: any }>) {
      state.usersLoading  = false;
      state.users         = action.payload.users;
      state.usersPagination = action.payload.pagination;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.usersLoading = false;
      state.usersError   = action.payload;
    },

    blockUserRequest(state, _action: PayloadAction<{ id: string; isBlocked: boolean }>) {
      state.actionLoading = true;
      state.actionError   = null;
    },
    blockUserSuccess(state, action: PayloadAction<AdminUser>) {
      state.actionLoading = false;
      const idx = state.users.findIndex((u) => u._id === action.payload._id);
      if (idx >= 0) state.users[idx] = action.payload;
    },
    blockUserFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.actionError   = action.payload;
    },

    // ── KYC ──────────────────────────────────────────────────
    fetchKycsRequest(state) {
      state.kycsLoading = true;
      state.kycsError   = null;
    },
    fetchKycsSuccess(state, action: PayloadAction<AdminKyc[]>) {
      state.kycsLoading = false;
      state.kycs        = action.payload;
    },
    fetchKycsFailure(state, action: PayloadAction<string>) {
      state.kycsLoading = false;
      state.kycsError   = action.payload;
    },

    verifyKycRequest(state, _action: PayloadAction<{ id: string; status: "APPROVED" | "REJECTED"; rejectionReason?: string }>) {
      state.actionLoading = true;
      state.actionError   = null;
    },
    verifyKycSuccess(state, action: PayloadAction<AdminKyc>) {
      state.actionLoading = false;
      const idx = state.kycs.findIndex((k) => k._id === action.payload._id);
      if (idx >= 0) state.kycs[idx] = action.payload;
    },
    verifyKycFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.actionError   = action.payload;
    },

    // ── Ads ───────────────────────────────────────────────────
    fetchAdsRequest(state) {
      state.adsLoading = true;
      state.adsError   = null;
    },
    fetchAdsSuccess(state, action: PayloadAction<AdminAd[]>) {
      state.adsLoading = false;
      state.ads        = action.payload;
    },
    fetchAdsFailure(state, action: PayloadAction<string>) {
      state.adsLoading = false;
      state.adsError   = action.payload;
    },

    updateAdStatusRequest(state, _action: PayloadAction<{ adId: string; action: "APPROVE" | "REJECT" | "DISABLE"; rejectionReason?: string }>) {
      state.actionLoading = true;
      state.actionError   = null;
    },
    updateAdStatusSuccess(state, action: PayloadAction<AdminAd>) {
      state.actionLoading = false;
      const idx = state.ads.findIndex((a) => a._id === action.payload._id);
      if (idx >= 0) state.ads[idx] = action.payload;
    },
    updateAdStatusFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.actionError   = action.payload;
    },

    // ── Deals ─────────────────────────────────────────────────
    fetchDealsRequest(state) {
      state.dealsLoading = true;
      state.dealsError   = null;
    },
    fetchDealsSuccess(state, action: PayloadAction<AdminDeal[]>) {
      state.dealsLoading = false;
      state.deals        = action.payload;
    },
    fetchDealsFailure(state, action: PayloadAction<string>) {
      state.dealsLoading = false;
      state.dealsError   = action.payload;
    },

    resolveDisputeRequest(state, _action: PayloadAction<{ id: string; resolution: "REFUND_BUYER" | "RELEASE_SELLER"; adminNote: string }>) {
      state.actionLoading = true;
      state.actionError   = null;
    },
    resolveDisputeSuccess(state, action: PayloadAction<AdminDeal>) {
      state.actionLoading = false;
      const idx = state.deals.findIndex((d) => d._id === action.payload._id);
      if (idx >= 0) state.deals[idx] = action.payload;
    },
    resolveDisputeFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.actionError   = action.payload;
    },

    // ── Auctions ──────────────────────────────────────────────
    fetchAuctionsRequest(state) {
      state.auctionsLoading = true;
      state.auctionsError   = null;
    },
    fetchAuctionsSuccess(state, action: PayloadAction<AdminAuction[]>) {
      state.auctionsLoading = false;
      state.auctions        = action.payload;
    },
    fetchAuctionsFailure(state, action: PayloadAction<string>) {
      state.auctionsLoading = false;
      state.auctionsError   = action.payload;
    },

    clearActionError(state) {
      state.actionError = null;
    },
  },
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;