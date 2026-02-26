import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* ---------------- TYPES ---------------- */

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthFlowState {
  type:
    | "NONE"
    | "SIGNUP"
    | "VERIFY_EMAIL"
    | "FORGOT_PASSWORD"
    | "RESET_PASSWORD";
  status: "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";
  email?: string;
  otp?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  accountStatus: "ACTIVE" | "SUSPENDED" | "REJECTED" | null;

  kycStatus: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED" | null;
  complianceLoaded: boolean;

  loading: boolean;
  error: string | null;

  flow: AuthFlowState;
}

/* ---------------- INITIAL STATE ---------------- */

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,

  accountStatus: null, // 🔥 ADD THIS

  kycStatus: null,
  complianceLoaded: false,

  loading: false,
  error: null,

  flow: {
    type: "NONE",
    status: "IDLE",
  },
};

/* ---------------- SLICE ---------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* -------- REQUEST TRIGGERS (FOR SAGA) -------- */

    signupRequest(
      _state,
      _action: PayloadAction<{ name: string; email: string; password: string }>,
    ) {},

    verifyOtpRequest(
      _state,
      _action: PayloadAction<{
        email: string;
        otp: string;
        mode: "VERIFY_EMAIL" | "FORGOT_PASSWORD";
      }>,
    ) {},

    forgotPasswordRequest(_state, _action: PayloadAction<{ email: string }>) {},

    resetPasswordRequest(
      _state,
      _action: PayloadAction<{
        email: string;
        otp: string;
        newPassword: string;
      }>,
    ) {},

    resendOtpRequest(_state, _action: PayloadAction<{ email: string }>) {},

    /* -------- FLOW MANAGEMENT -------- */

    startFlow(state, action: PayloadAction<AuthFlowState["type"]>) {
      state.flow = {
        type: action.payload,
        status: "LOADING",
      };
      state.error = null;
    },

    flowSuccess(
      state,
      action: PayloadAction<{ email?: string; otp?: string }>,
    ) {
      state.flow.status = "SUCCESS";
      state.flow.email = action.payload.email;
      state.flow.otp = action.payload.otp;
    },

    flowFailure(state, action: PayloadAction<string>) {
      state.flow.status = "FAILURE";
      state.error = action.payload;
    },

    resetFlow(state) {
      state.flow = {
        type: "NONE",
        status: "IDLE",
      };
      state.error = null;
    },

    /* -------- LOGIN -------- */

    loginRequest(
      state,
      _action: PayloadAction<{
        email: string;
        password: string;
        rememberMe?: boolean;
      }>,
    ) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        accountStatus?: "ACTIVE" | "SUSPENDED" | "REJECTED";
        kycStatus?: AuthState["kycStatus"];
      }>,
    ) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.accountStatus = action.payload.accountStatus || "ACTIVE";
      state.kycStatus = action.payload.kycStatus
        ? (action.payload.kycStatus.toUpperCase() as AuthState["kycStatus"])
        : null;
      state.isAuthenticated = true;
      state.complianceLoaded = true; // ✅ Set to true on login
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    setCompliance(
      state,
      action: PayloadAction<{
        kycStatus: AuthState["kycStatus"];
      }>,
    ) {
      state.kycStatus = action.payload.kycStatus;
      state.complianceLoaded = true;
    },

    resetCompliance(state) {
      state.kycStatus = null;
      state.complianceLoaded = false;
    },

    hydrateSessionRequest(state) {
      state.loading = true;
    },

    hydrateSessionSuccess(
      state,
      action: PayloadAction<{
        user: User;
        accountStatus: "ACTIVE" | "SUSPENDED" | "REJECTED";
        kycStatus: AuthState["kycStatus"];
      }>,
    ) {
      state.loading = false;
      state.user = action.payload.user;
      state.accountStatus = action.payload.accountStatus;
      state.kycStatus = action.payload.kycStatus;
      state.isAuthenticated = true;
      state.complianceLoaded = true;
    },

    hydrateSessionFailure(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accountStatus = null;
      state.kycStatus = null;
      state.complianceLoaded = false;
    },

    /* -------- LOGOUT -------- */

    logout() {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
      return initialState;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
