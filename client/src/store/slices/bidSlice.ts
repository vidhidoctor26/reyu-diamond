import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Bid {
  _id: string;
  auctionId: string;
  buyerId: string;
  bidAmount: number;
  status: "ACTIVE" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  isHighestBid: boolean;
  createdAt: string;
}

interface BidState {
  myBids: Bid[];
  auctionBids: Bid[];
  highestBid: Bid | null;
  placing: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: BidState = {
  myBids: [],
  auctionBids: [],
  highestBid: null,
  placing: false,
  loading: false,
  error: null,
  successMessage: null,
};

const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    // Place bid
    placeBidRequest(state, _action: PayloadAction<{
      auctionId: string;
      bidAmount: number;
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    }>) {
      state.placing = true;
      state.error = null;
      state.successMessage = null;
    },

    placeBidSuccess(state, action: PayloadAction<Bid>) {
      state.placing = false;
      state.successMessage = "Bid placed successfully!";
      const idx = state.myBids.findIndex((b) => b.auctionId === action.payload.auctionId);
      if (idx >= 0) state.myBids[idx] = action.payload;
      else state.myBids.unshift(action.payload);
    },

    placeBidFailure(state, action: PayloadAction<string>) {
      state.placing = false;
      state.error = action.payload;
    },

    // Fetch my bids for an auction
    fetchMyBidRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
    },

    fetchMyBidSuccess(state, action: PayloadAction<Bid[]>) {
      state.loading = false;
      state.myBids = action.payload;
    },

    fetchMyBidFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch highest bid for an auction
    fetchHighestBidRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
    },

    fetchHighestBidSuccess(state, action: PayloadAction<Bid | null>) {
      state.loading = false;
      state.highestBid = action.payload;
    },

    fetchHighestBidFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch all bids for an auction (seller view)
    fetchAuctionBidsRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
    },

    fetchAuctionBidsSuccess(state, action: PayloadAction<Bid[]>) {
      state.loading = false;
      state.auctionBids = action.payload;
    },

    fetchAuctionBidsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchAllMyBidsRequest(state) {
      state.loading = true;
      state.error = null;
    },

    fetchAllMyBidsSuccess(state, action: PayloadAction<Bid[]>) {
      state.loading = false;
      state.myBids = action.payload;
    },

    fetchAllMyBidsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchBidsReceivedRequest(state) {
      state.loading = true;
      state.error = null;
    },

    fetchBidsReceivedSuccess(state, action: PayloadAction<Bid[]>) {
      state.loading = false;
      state.auctionBids = action.payload;
    },
    
    fetchBidsReceivedFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    resetBidState() {
      return initialState;
    },

    clearBidError(state) { state.error = null; },
    clearBidSuccess(state) { state.successMessage = null; },
  },
});

export const bidActions = bidSlice.actions;
export default bidSlice.reducer;