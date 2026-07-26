import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type KycStatus = "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";

export type KycStep =
  | "START"
  | "PERSONAL_DETAILS"
  | "DOCUMENT_UPLOAD"
  | "REVIEW_DOCUMENTS"
  | "STATUS";

interface KycDocuments {
  aadhaarFile?: File;
  panFile?: File;
  selfieFile?: File | null;
  aadhaarNumber?: string;
  panNumber?: string;
}


interface KycState {
  skipped: boolean;
  currentStep: KycStep;
  loading: boolean;
  error: string | null;
  rejectionReason: string | null;
  personalDetails?: Record<string, any>;
  documents?: KycDocuments;
}

/* ================= INITIAL STATE ================= */

const initialState: KycState = {
  skipped: false,
  currentStep: "START",
  loading: false,
  error: null,
  rejectionReason: null,
};

/* ================= SLICE ================= */

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    /* ---------- UI STEP CONTROL ---------- */
    goToStep(state, action: PayloadAction<KycStep>) {
      state.currentStep = action.payload;
    },

    /* ---------- SUBMIT KYC ---------- */
    submitKycRequest(
      state,
      _action: PayloadAction<{
        aadhaarFile: File;
        panFile: File;
        selfieFile?: File | null;
        aadhaarNumber: string;
        panNumber: string;
      }>,
    ) {
      state.loading = true;
    },

    submitKycSuccess(state, _action: PayloadAction<{ status: KycStatus }>) {
      state.loading = false;
      // state.status = action.payload.status;
      state.currentStep = "STATUS";
      state.skipped = false;
    },

    submitKycFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    /* ---------- FETCH STATUS ---------- */
    // fetchKycStatusRequest(state) {
    //   state.loading = true;
    // },

    // setKycStatus(
    //   state,
    //   action: PayloadAction<{
    //     status: KycStatus;
    //     rejectionReason?: string | null;
    //   }>,
    // ) {
    //   state.loading = false;
    //   state.status = action.payload.status;
    //   state.rejectionReason = action.payload.rejectionReason ?? null;
    //   state.currentStep = "STATUS";
    // },

    // fetchKycStatusFailure(state) {
    //   state.loading = false;
    // },

    /* ---------- PERSONAL DETAILS ---------- */
    setPersonalDetails(state, action: PayloadAction<Record<string, any>>) {
      state.personalDetails = action.payload;
    },

    /* ---------- DOCUMENT METADATA ONLY ---------- */
    setDocuments(state, action: PayloadAction<Partial<KycDocuments>>) {
      state.documents = {
        ...state.documents,
        ...action.payload,
      };
    },

    /* ---------- SKIP ---------- */
    skipKyc(state) {
      state.skipped = true;
      state.currentStep = "STATUS";
    },

    /* ---------- RESET ---------- */
    resetKycSession() {
      return initialState;
    },

    resetKycError(state) {
      state.error = null;
    },
  },
});

export const kycActions = kycSlice.actions;
export default kycSlice.reducer;
