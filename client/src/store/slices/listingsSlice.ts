import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface ListingState {
  listings: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ListingState = {
  listings: [],
  loading: false,
  error: null,
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    fetchMyListingsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMyListingsSuccess: (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.listings = action.payload;
    },
    fetchMyListingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMyListingsRequest,
  fetchMyListingsSuccess,
  fetchMyListingsFailure,
} = listingsSlice.actions;

export default listingsSlice.reducer;