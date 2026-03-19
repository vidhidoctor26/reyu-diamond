import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InventoryFormData } from "@/schemas/user/inventory.schema";

export interface InventoryItem extends InventoryFormData {
  _id: string;
  sellerId: string;
  barcode: string;
  status: "available" | "listed" | "on_memo" | "sold";
  locked: boolean;
  images: string[];
  video?: string;
  createdAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  loading: boolean;
  error: string | null;
}

// ─── Reusable callback shape ───────────────────────────────────────────────
export interface SagaCallbacks {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const initialState: InventoryState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    /* ================= LIST ================= */

    fetchInventoryRequest(state) {
      state.loading = true;
      state.error = null;
    },

    fetchInventorySuccess(state, action: PayloadAction<InventoryItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },

    fetchInventoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    /* ================= CREATE ================= */

    createInventoryRequest(
      state,
      _action: PayloadAction<{
        data: any;
        media?: any;
        onSuccess?: () => void;
        onError?: (msg: string) => void;
      }>,
    ) {
      state.loading = true;
      state.error = null;
    },

    createInventorySuccess(state, action: PayloadAction<InventoryItem>) {
      state.loading = false;
      state.items.unshift(action.payload);
    },

    createInventoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    /* ================= GET BY ID ================= */

    fetchInventoryByIdRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },

    fetchInventoryByIdSuccess(state, action: PayloadAction<InventoryItem>) {
      state.loading = false;
      state.selectedItem = action.payload;
    },

    fetchInventoryByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearSelectedInventory(state) {
      state.selectedItem = null;
    },

    /* ================= UPDATE ================= */

    updateInventoryRequest(
      state,
      _action: PayloadAction<{
        id: string;
        data: any;
        media?: any;
        onSuccess?: () => void;
        onError?: (msg: string) => void;
      }>,
    ) {
      state.loading = true;
      state.error = null;
    },

    updateInventorySuccess(state, action: PayloadAction<InventoryItem>) {
      state.loading = false;
      state.selectedItem = action.payload;

      const index = state.items.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    updateInventoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    /* ================= DELETE ================= */

    deleteInventoryRequest(
      state,
      _action: PayloadAction<{
        id: string;
        onSuccess?: () => void;
        onError?: (msg: string) => void;
      }>,
    ) {
      state.loading = true;
      state.error = null;
    },

    deleteInventorySuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.items = state.items.filter((item) => item._id !== action.payload);
      if (state.selectedItem?._id === action.payload) {
        state.selectedItem = null;
      }
    },

    deleteInventoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearInventory(state) {
      state.items = [];
      state.selectedItem = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchInventoryRequest,
  fetchInventorySuccess,
  fetchInventoryFailure,
  createInventoryRequest,
  createInventorySuccess,
  createInventoryFailure,
  fetchInventoryByIdRequest,
  fetchInventoryByIdSuccess,
  fetchInventoryByIdFailure,
  updateInventoryRequest,
  updateInventorySuccess,
  updateInventoryFailure,
  deleteInventoryRequest,
  deleteInventorySuccess,
  deleteInventoryFailure,
  clearSelectedInventory,
  clearInventory,
} = inventorySlice.actions;

export default inventorySlice.reducer;