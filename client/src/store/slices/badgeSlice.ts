import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BadgeTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  isEarned: boolean;
  earnedAt: string | null;
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
}

interface BadgeState {
  myBadges: Badge[];
  userBadges: Badge[];      // badges for the seller being viewed
  loading: boolean;
  error: string | null;
}

const initialState: BadgeState = {
  myBadges: [],
  userBadges: [],
  loading: false,
  error: null,
};

const badgeSlice = createSlice({
  name: "badge",
  initialState,
  reducers: {
    fetchUserBadgesRequest(
      state,
      _action: PayloadAction<{ userId: string }>
    ) {
      state.loading = true;
      state.error = null;
    },
    fetchUserBadgesSuccess(state, action: PayloadAction<Badge[]>) {
      state.loading = false;
      state.userBadges = action.payload;
    },
    fetchUserBadgesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchMyBadgesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMyBadgesSuccess(state, action: PayloadAction<Badge[]>) {
      state.loading = false;
      state.myBadges = action.payload;
    },
    fetchMyBadgesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearUserBadges(state) {
      state.userBadges = [];
    },
  },
});

export const badgeActions = badgeSlice.actions;
export default badgeSlice.reducer;