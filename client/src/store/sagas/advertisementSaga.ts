import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";

import {
  fetchMyAdsRequest,
  fetchMyAdsSuccess,
  fetchMyAdsFailure,
  fetchAdByIdRequest,
  fetchAdByIdSuccess,
  fetchAdByIdFailure,
  fetchActiveAdsRequest,
  fetchActiveAdsSuccess,
  fetchActiveAdsFailure,
  createAdRequest,
  createAdSuccess,
  createAdFailure,
  type Advertisement,
} from "@/store/slices/advertisementSlice";

import {
  getMyAdsAPI,
  getAdByIdAPI,
  getActiveAdsAPI,
  requestAdAPI,
  type CreateAdPayload,
  type BannerSection,
} from "@/services/advertisement.service";  

// ── helpers ───────────────────────────────────────────────────────────────────
const extractMessage = (error: any, fallback: string): string =>
  error?.response?.data?.message || fallback;

// ── Fetch My Ads ──────────────────────────────────────────────────────────────
function* fetchMyAdsSaga() {
  try {
    const res: AxiosResponse<{ data: Advertisement[] }> = yield call(getMyAdsAPI);
    yield put(fetchMyAdsSuccess(res.data.data));
  } catch (error: any) {
    const msg = extractMessage(error, "Failed to fetch advertisements");
    yield put(fetchMyAdsFailure(msg));
    toast.error(msg);
  }
}

// ── Fetch Ad By Id ────────────────────────────────────────────────────────────
function* fetchAdByIdSaga(action: PayloadAction<string>) {
  try {
    const res: AxiosResponse<{ data: Advertisement }> = yield call(
      getAdByIdAPI,
      action.payload
    );
    yield put(fetchAdByIdSuccess(res.data.data));
  } catch (error: any) {
    const msg = extractMessage(error, "Failed to fetch advertisement");
    yield put(fetchAdByIdFailure(msg));
    toast.error(msg);
  }
}

// ── Fetch Active Ads ──────────────────────────────────────────────────────────
function* fetchActiveAdsSaga(action: PayloadAction<BannerSection | undefined>) {
  try {
    const res: AxiosResponse<{ data: Advertisement[] }> = yield call(
      getActiveAdsAPI,
      action.payload
    );
    yield put(fetchActiveAdsSuccess(res.data.data));
  } catch (error: any) {
    const msg = extractMessage(error, "Failed to fetch active advertisements");
    yield put(fetchActiveAdsFailure(msg));
    toast.error(msg);
  }
}

// ── Create / Request Ad ───────────────────────────────────────────────────────
function* createAdSaga(action: PayloadAction<CreateAdPayload>) {
  try {
    const res: AxiosResponse<{ data: Advertisement }> = yield call(
      requestAdAPI,
      action.payload
    );
    yield put(createAdSuccess(res.data.data));
    toast.success("Advertisement submitted! Pending admin approval.");
  } catch (error: any) {
    const msg = extractMessage(error, "Failed to submit advertisement");
    yield put(createAdFailure(msg));
    toast.error(msg);
  }
}

// ── Root Advertisement Saga ───────────────────────────────────────────────────
export function* advertisementSaga() {
  yield takeLatest(fetchMyAdsRequest.type,     fetchMyAdsSaga);
  yield takeLatest(fetchAdByIdRequest.type,    fetchAdByIdSaga);
  yield takeLatest(fetchActiveAdsRequest.type, fetchActiveAdsSaga);
  yield takeLatest(createAdRequest.type,       createAdSaga);
}