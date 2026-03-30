import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface RatingCategory {
  communication?: number;
  productQuality?: number;
  delivery?: number;
  pricing?: number;
  professionalism?: number;
}

export interface Rating {
  _id: string;
  userId: string;
  raterId: { _id: string; name: string; email: string } | string;
  dealId: string;
  rating: number;
  review?: string;
  categories?: RatingCategory;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingsData {
  user: {
    _id: string;
    name: string;
    email: string;
    stats?: any;
  } | null;
  ratings: Rating[];
}

interface RatingState {
  myRatings: RatingsData | null;
  userRatings: RatingsData | null;
  loading: boolean;
  submitLoading: boolean;
  error: string | null;
}

const initialState: RatingState = {
  myRatings: null,
  userRatings: null,
  loading: false,
  submitLoading: false,
  error: null,
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    // Submit rating
    submitRatingRequest(
      state,
      _action: PayloadAction<{
        userId: string;
        dealId: string;
        rating: number;
        review?: string;
        categories?: RatingCategory;
        isAnonymous?: boolean;
        onSuccess?: () => void;
        onError?: (msg: string) => void;
      }>
    ) {
      state.submitLoading = true;
      state.error = null;
    },
    submitRatingSuccess(state, action: PayloadAction<Rating>) {
      state.submitLoading = false;
      // Optimistically append to myRatings list if loaded
      if (state.myRatings) {
        state.myRatings.ratings.unshift(action.payload);
      }
    },
    submitRatingFailure(state, action: PayloadAction<string>) {
      state.submitLoading = false;
      state.error = action.payload;
    },

    // Fetch ratings for a specific user (public)
    fetchUserRatingsRequest(
      state,
      _action: PayloadAction<{
        userId: string;
        onSuccess?: () => void;
        onError?: (msg: string) => void;
      }>
    ) {
      state.loading = true;
      state.error = null;
    },
    fetchUserRatingsSuccess(state, action: PayloadAction<RatingsData>) {
      state.loading = false;
      state.userRatings = action.payload;
    },
    fetchUserRatingsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch my own ratings (authenticated)
    fetchMyRatingsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMyRatingsSuccess(state, action: PayloadAction<RatingsData>) {
      state.loading = false;
      state.myRatings = action.payload;
    },
    fetchMyRatingsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearRatingError(state) {
      state.error = null;
    },
    clearUserRatings(state) {
      state.userRatings = null;
    },
  },
});

export const ratingActions = ratingSlice.actions;
export default ratingSlice.reducer;