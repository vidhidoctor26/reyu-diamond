import { takeLatest, call, put } from "redux-saga/effects";
import { type PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { ENDPOINTS } from "@/services/endpoints";
import { authActions } from "../slices/authSlice";
import { clearInventory } from "@/store/slices/inventorySlice";
import { auctionActions } from "@/store/slices/auctionSlice";
import { bidActions } from "@/store/slices/bidSlice";

/* ================= TOKEN HELPER ================= */

function setAuthToken(token?: string, rememberMe?: boolean) {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  if (token) {
    if (rememberMe) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/* ================= SIGNUP ================= */

function* signupWorker(
  action: PayloadAction<{ name: string; email: string; password: string }>,
): Generator {
  try {
    yield put(authActions.startFlow("SIGNUP"));

    yield call(api.post, ENDPOINTS.AUTH.REGISTER, action.payload);

    yield put(
      authActions.flowSuccess({
        email: action.payload.email,
      }),
    );
  } catch (err: any) {
    yield put(
      authActions.flowFailure(err.response?.data?.message || "Signup failed"),
    );
  }
}

/* ================= LOGIN ================= */

function* loginWorker(
  action: PayloadAction<{
    email: string;
    password: string;
    rememberMe?: boolean;
  }>
): Generator {
  try {
    const res: any = yield call(api.post, ENDPOINTS.AUTH.LOGIN, {
      email: action.payload.email,
      password: action.payload.password,
    });

    const { token, user } = res.data.data;

    // ✅ Store token
    setAuthToken(token, action.payload.rememberMe);

    // ✅ Normalize user
    const normalizedUser = {
      id: user._id || user.id,
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    yield put(
      authActions.loginSuccess({
        user: normalizedUser,
        token,
        accountStatus: user.isBlocked ? "SUSPENDED" : "ACTIVE",
        kycStatus:
          user.kycStatus === "not_submitted" ? "NOT_STARTED" : user.kycStatus,
      })
    );
  } catch (err: any) {
    setAuthToken(undefined);
    const response = err.response?.data;
    yield put(authActions.loginFailure(response?.message || "Login failed"));
  }
}

/* ================= VERIFY OTP ================= */

function* verifyOtpWorker(
  action: PayloadAction<{
    email: string;
    otp: string;
    mode: "VERIFY_EMAIL" | "FORGOT_PASSWORD";
  }>,
): Generator {
  try {
    const { email, otp, mode } = action.payload;

    if (mode === "VERIFY_EMAIL") {
      yield put(authActions.startFlow("VERIFY_EMAIL"));

      yield call(api.post, ENDPOINTS.AUTH.VERIFY_EMAIL, {
        email,
        otp,
      });

      yield put(authActions.flowSuccess({ email }));
    }

    if (mode === "FORGOT_PASSWORD") {
      yield put(authActions.startFlow("RESET_PASSWORD"));

      // Do not call API yet (handled on actual reset)
      yield put(authActions.flowSuccess({ email, otp }));
    }
  } catch (err: any) {
    yield put(
      authActions.flowFailure(
        err.response?.data?.message || "OTP verification failed",
      ),
    );
  }
}

/* ================= FORGOT PASSWORD ================= */

function* forgotPasswordWorker(
  action: ReturnType<typeof authActions.forgotPasswordRequest>,
) {
  try {
    // 1️⃣ Start flow
    yield put(authActions.startFlow("FORGOT_PASSWORD"));

    // 2️⃣ Call API
    yield call(api.post, "/auth/forgot-password", {
      email: action.payload.email,
    });

    // 3️⃣ Success
    yield put(
      authActions.flowSuccess({
        email: action.payload.email,
      }),
    );
  } catch (error: any) {
    yield put(
      authActions.flowFailure(
        error.response?.data?.message || "Failed to send OTP",
      ),
    );
  }
}

/* ================= RESET PASSWORD ================= */

function* resetPasswordWorker(
  action: PayloadAction<{
    email: string;
    otp: string;
    newPassword: string;
  }>,
): Generator {
  try {
    yield put(authActions.startFlow("RESET_PASSWORD"));

    yield call(api.post, ENDPOINTS.AUTH.RESET_PASSWORD, {
      email: action.payload.email,
      otp: action.payload.otp,
      newPassword: action.payload.newPassword,
    });

    yield put(authActions.flowSuccess({}));
  } catch (err: any) {
    yield put(
      authActions.flowFailure(
        err.response?.data?.message || "Password reset failed",
      ),
    );
  }
}

/* ================= RESEND OTP ================= */

function* resendOtpWorker(action: PayloadAction<{ email: string }>): Generator {
  try {
    yield call(api.post, ENDPOINTS.AUTH.RESEND_OTP, action.payload);
  } catch (err: any) {
    yield put(
      authActions.flowFailure(
        err.response?.data?.message || "Failed to resend OTP",
      ),
    );
  }
}

/* ================= HYDRATE SESSION ================= */

function* hydrateSessionWorker(): Generator<any, any, any> {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      yield put(authActions.hydrateSessionFailure());
      return;
    }

    // ✅ attach token to axios header
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    // ✅ fetch user profile
    const profileRes = yield call(api.get, "/user/profile");
    const serverUser = profileRes.data.data.user;

    if (!serverUser) {
      throw new Error("User data missing from profile response");
    }

    // ✅ fetch kyc status with fallback
    let kycStatus = serverUser.isKycVerified ? "APPROVED" : "NOT_STARTED";

    try {
      const kycRes = yield call(api.get, "/kyc/me");
      if (kycRes?.data?.data?.status) {
        kycStatus = kycRes.data.data.status.toUpperCase();
      }
    } catch (kycErr: any) {
      if (kycErr.response?.status !== 404) {
        console.error("KYC fetch error during hydration:", kycErr);
      }
    }

    yield put(
      authActions.hydrateSessionSuccess({
        user: {
          id: serverUser._id || serverUser.id,
          _id: serverUser._id || serverUser.id,
          name: serverUser.name,
          email: serverUser.email,
          role: serverUser.role,
        },
        token, // ✅ pass token so Redux state has it
        accountStatus: serverUser.isBlocked ? "SUSPENDED" : "ACTIVE",
        kycStatus: kycStatus as any,
      }),
    );
  } catch (err) {
    console.error("Hydration failed:", err);
    yield put(authActions.hydrateSessionFailure());
  }
}

function* logoutWorker(): Generator {
  try {
    // Clear token from storage + axios headers
    setAuthToken(undefined);

    // Clear all other slices first
    yield put(clearInventory());
    yield put(auctionActions.fetchAuctionsSuccess([]));
    yield put(auctionActions.fetchMyAuctionsSuccess([]));
    yield put(bidActions.resetBidState());

    // Finally reset auth state
    yield put(authActions.logoutSuccess());
  } catch (err) {
    // Even if clearing other slices fails, always clear auth + token
    console.error("logoutWorker error:", err);
    setAuthToken(undefined);
    yield put(authActions.logoutSuccess());
  }
}

/* ================= WATCHERS ================= */

export default function* authSaga(): Generator {
  yield takeLatest(authActions.signupRequest.type, signupWorker);
  yield takeLatest(authActions.loginRequest.type, loginWorker);
  yield takeLatest(authActions.verifyOtpRequest.type, verifyOtpWorker);
  yield takeLatest(authActions.resendOtpRequest.type, resendOtpWorker);
  yield takeLatest(
    authActions.forgotPasswordRequest.type,
    forgotPasswordWorker,
  );
  yield takeLatest(authActions.resetPasswordRequest.type, resetPasswordWorker);
  yield takeLatest(
    authActions.hydrateSessionRequest.type,
    hydrateSessionWorker,
  );
  yield takeLatest(authActions.logoutRequest.type, logoutWorker);
}
