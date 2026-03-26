import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export interface InventoryDetails {
  _id: string;
  title: string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  images: string[];
  price: number;
}

export interface Auction {
  _id: string;
  inventoryId: InventoryDetails;
  sellerId: {
    _id: string;
    name: string;
    email: string;
  };
  basePrice: number;
  currentBid: number;
  highestBidderId?: {
    _id: string;
    name: string;
    email: string;
  };
  highestBidId?: string;
  bidIds: string[];
  status: "upcoming" | "active" | "ended" | "cancelled";
  startDate: string;
  endDate: string;
  locked: boolean;
  createdAt: string;
}

interface AuctionState {
  auctions: Auction[];        // marketplace
  myAuctions: Auction[];      // my listings
  selectedAuction: Auction | null;

  loading: boolean;
  myLoading: boolean;

  error: string | null;
}

const initialState: AuctionState = {
  auctions: [],
  myAuctions: [],
  selectedAuction: null,

  loading: false,
  myLoading: false,

  error: null,
};

/* ================= SLICE ================= */

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    fetchAuctionsRequest(state, _action: PayloadAction<any>) {
      state.loading = true;
      state.error = null;
    },

    fetchAuctionsSuccess(state, action: PayloadAction<Auction[]>) {
      state.loading = false;
      state.auctions = action.payload;
    },

    fetchAuctionsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    /* ================= MY AUCTIONS ================= */

    fetchMyAuctionsRequest(state, _action: PayloadAction<any>) {
      state.myLoading = true;
    },

    fetchMyAuctionsSuccess(state, action: PayloadAction<Auction[]>) {
      state.myLoading = false;
      state.myAuctions = action.payload;
    },

    fetchMyAuctionsFailure(state, action: PayloadAction<string>) {
      state.myLoading = false;
      state.error = action.payload;
    },

    fetchAuctionByIdRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
    },

    fetchAuctionByIdSuccess(state, action: PayloadAction<Auction>) {
      state.loading = false;
      state.selectedAuction = action.payload;
    },

    fetchAuctionByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

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

    createAuctionSuccess(state, action: PayloadAction<Auction>) {
      state.loading = false;
      const exists = state.auctions.find((a) => a._id === action.payload._id);
      if (!exists) {
        state.auctions.unshift(action.payload);
      }
    },

    createAuctionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    updateAuctionRequest(state, _action: PayloadAction<{
      auctionId: string;
      updates: { basePrice?: number; startDate?: string; endDate?: string };
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    }>) {
      state.loading = true;
    },

    updateAuctionSuccess(state, action: PayloadAction<Auction>) {
      state.loading = false;
      const idx = state.myAuctions.findIndex((a) => a._id === action.payload._id);
      if (idx >= 0) state.myAuctions[idx] = action.payload;
    },

    updateAuctionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteAuctionRequest(state, _action: PayloadAction<{
      auctionId: string;
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    }>) {
      state.loading = true;
    },

    deleteAuctionSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      // Remove from both lists
      state.myAuctions = state.myAuctions.filter((a) => a._id !== action.payload);
      state.auctions = state.auctions.filter((a) => a._id !== action.payload);
    },

    deleteAuctionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearAuctionError(state) {
      state.error = null;
    },
    clearSelectedAuction(state) {
      state.selectedAuction = null;
    },

    updateAuctionStatus(state, action: PayloadAction<{ auctionId: string, status: Auction['status'], locked?: boolean }>) {
      if (state.selectedAuction && state.selectedAuction._id === action.payload.auctionId) {
        state.selectedAuction.status = action.payload.status;
        if (action.payload.locked !== undefined) state.selectedAuction.locked = action.payload.locked;
      }
      const idx = state.myAuctions.findIndex(a => a._id === action.payload.auctionId);
      if (idx >= 0) {
        state.myAuctions[idx].status = action.payload.status;
        if (action.payload.locked !== undefined) state.myAuctions[idx].locked = action.payload.locked;
      }
    },
  },
});

export const auctionActions = auctionSlice.actions;
export default auctionSlice.reducer;