import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuctionState {
  loading: boolean;
  error: string | null;
}

const initialState: AuctionState = {
  loading: false,
  error: null,
};

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    /* -------- REQUEST (Saga Trigger) -------- */

    createAuctionRequest(
      state,
      _action: PayloadAction<{
        inventoryId: string;
        basePrice: number;
        startDate: string;
        endDate: string;
        onSuccess?: () => void;
        onError?: (message: string) => void;
      }>
    ) {
      state.loading = true;
      state.error = null;
    },

    /* -------- SUCCESS -------- */

    createAuctionSuccess(state) {
      state.loading = false;
    },

    /* -------- FAILURE -------- */

    createAuctionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const auctionActions = auctionSlice.actions;
export default auctionSlice.reducer;