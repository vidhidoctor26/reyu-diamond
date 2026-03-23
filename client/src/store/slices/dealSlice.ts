import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DealStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "IN_ESCROW"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED";

export interface Deal {
  _id: string;
  bidId: string;
  auctionId: any;
  inventoryId: any;
  buyerId: { _id: string; name: string; email: string };
  sellerId: { _id: string; name: string; email: string };
  dealAmount: number;
  currency: string;
  status: DealStatus;
  payment: { isPaid: boolean; paidAt?: string };
  shipping?: {
    courier?: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  dispute?: {
    reason: string;
    raisedBy: string;
    raisedAt: string;
    resolvedBy?: string;
    resolvedAt?: string;
    resolution?: "REFUND_BUYER" | "RELEASE_SELLER";
    adminNote?: string;
  };
  sellerConfirmedShipped?: boolean;
  buyerConfirmedDelivered?: boolean;
  history: {
    status: DealStatus;
    changedBy: string;
    changedAt: string;
    note?: string;
  }[];
  pdfPath?: string;
  createdAt: string;
  updatedAt: string;
}

interface DealState {
  deals: Deal[];
  selectedDeal: Deal | null;
  loading: boolean;
  actionLoading: boolean;
  pdfLoading: boolean;
  paymentLoading: boolean;
  clientSecret: string | null;
  error: string | null;
}

const initialState: DealState = {
  deals: [],
  selectedDeal: null,
  loading: false,
  actionLoading: false,
  pdfLoading: false,
  paymentLoading: false,
  clientSecret: null,
  error: null,
};

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    // Fetch all deals
    fetchDealsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDealsSuccess(state, action: PayloadAction<Deal[]>) {
      state.loading = false;
      state.deals = action.payload;
    },
    fetchDealsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single deal
    fetchDealByIdRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    fetchDealByIdSuccess(state, action: PayloadAction<Deal>) {
      state.loading = false;
      state.selectedDeal = action.payload;
    },
    fetchDealByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Mark shipped
    markShippedRequest(state, _action: PayloadAction<{
      dealId: string;
      courier: string;
      trackingNumber: string;
      note?: string;
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    }>) {
      state.actionLoading = true;
    },
    markShippedSuccess(state, action: PayloadAction<Deal>) {
      state.actionLoading = false;
      state.selectedDeal = action.payload;
      const idx = state.deals.findIndex((d) => d._id === action.payload._id);
      if (idx >= 0) state.deals[idx] = action.payload;
    },
    markShippedFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Confirm delivered
    confirmDeliveredRequest(state, _action: PayloadAction<{
      dealId: string;
      note?: string;
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    }>) {
      state.actionLoading = true;
    },
    confirmDeliveredSuccess(state, action: PayloadAction<Deal>) {
      state.actionLoading = false;
      state.selectedDeal = action.payload;
      const idx = state.deals.findIndex((d) => d._id === action.payload._id);
      if (idx >= 0) state.deals[idx] = action.payload;
    },
    confirmDeliveredFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Cancel deal
    cancelDealRequest(state, _action: PayloadAction<{
      dealId: string;
      note?: string;
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    }>) {
      state.actionLoading = true;
    },
    cancelDealSuccess(state, action: PayloadAction<Deal>) {
      state.actionLoading = false;
      state.selectedDeal = action.payload;
      const idx = state.deals.findIndex((d) => d._id === action.payload._id);
      if (idx >= 0) state.deals[idx] = action.payload;
    },
    cancelDealFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Raise dispute
    raiseDisputeRequest(state, _action: PayloadAction<{
      dealId: string;
      reason: string;
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    }>) {
      state.actionLoading = true;
    },
    raiseDisputeSuccess(state, action: PayloadAction<Deal>) {
      state.actionLoading = false;
      state.selectedDeal = action.payload;
      const idx = state.deals.findIndex((d) => d._id === action.payload._id);
      if (idx >= 0) state.deals[idx] = action.payload;
    },
    raiseDisputeFailure(state, action: PayloadAction<string>) {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Generate PDF
    generatePdfRequest(state, _action: PayloadAction<{
      dealId: string;
      onSuccess?: (pdfUrl: string) => void;
      onError?: (msg: string) => void;
    }>) {
      state.pdfLoading = true;
    },

    generatePdfSuccess(state, action: PayloadAction<{ pdfUrl: string; dealId: string }>) {
      state.pdfLoading = false;
      if (state.selectedDeal?._id === action.payload.dealId) {
        state.selectedDeal.pdfPath = action.payload.pdfUrl;
      }
    },

    generatePdfFailure(state, action: PayloadAction<string>) {
      state.pdfLoading = false;
      state.error = action.payload;
    },

    //payment intent
    createPaymentIntentRequest(state, _action: PayloadAction<{
      dealId: string;
      onSuccess?: (clientSecret: string) => void;
      onError?: (msg: string) => void;
    }>) {
      state.paymentLoading = true;
    },

    createPaymentIntentSuccess(state, action: PayloadAction<{ clientSecret: string; dealId: string }>) {
      state.paymentLoading = false;
      state.clientSecret = action.payload.clientSecret;
      if (state.selectedDeal?._id === action.payload.dealId) {
        state.selectedDeal.status = "PAYMENT_PENDING";
      }
    },

    createPaymentIntentFailure(state, action: PayloadAction<string>) {
      state.paymentLoading = false;
      state.error = action.payload;
    },

    releaseEscrowRequest(state, _action: PayloadAction<{
  dealId: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}>) { state.actionLoading = true; },
releaseEscrowSuccess(state, action: PayloadAction<any>) {
  state.actionLoading = false;
  if (action.payload?.deal) state.selectedDeal = action.payload.deal;
},
releaseEscrowFailure(state, action: PayloadAction<string>) {
  state.actionLoading = false;
  state.error = action.payload;
},

    clearClientSecret(state) {
      state.clientSecret = null;
    },

    clearSelectedDeal(state) {
      state.selectedDeal = null;
    },
    clearDealError(state) {
      state.error = null;
    },
  },
});

export const dealActions = dealSlice.actions;
export default dealSlice.reducer;