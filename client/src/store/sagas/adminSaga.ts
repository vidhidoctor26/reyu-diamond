import { call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { adminActions } from "@/store/slices/adminSlice";
import {
  getAdminStatsAPI,
  getAllUsersAPI,
  updateUserStatusAPI,
  getAllKycsAPI,
  verifyKycAPI,
  getAllAdsAdminAPI,
  updateAdStatusAdminAPI,
  getAllDealsAdminAPI,
  resolveDisputeAPI,
  getAllAuctionsAdminAPI,
} from "@/services/admin.service";

const msg = (error: any, fallback: string) =>
  error?.response?.data?.message || fallback;

// ── Dashboard Stats ───────────────────────────────────────────────────────────
function* fetchStatsSaga() {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(getAdminStatsAPI);
    yield put(adminActions.fetchStatsSuccess(res.data.data));
  } catch (error: any) {
    yield put(adminActions.fetchStatsFailure(msg(error, "Failed to load stats")));
  }
}

// ── Users ─────────────────────────────────────────────────────────────────────
function* fetchUsersSaga(action: PayloadAction<{ page?: number; limit?: number }>) {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(
      getAllUsersAPI,
      action.payload.page,
      action.payload.limit
    );
    yield put(adminActions.fetchUsersSuccess(res.data.data));
  } catch (error: any) {
    yield put(adminActions.fetchUsersFailure(msg(error, "Failed to load users")));
  }
}

function* blockUserSaga(action: PayloadAction<{ id: string; isBlocked: boolean }>) {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(
      updateUserStatusAPI,
      action.payload.id,
      action.payload.isBlocked
    );
    yield put(adminActions.blockUserSuccess(res.data.data));
    toast.success(action.payload.isBlocked ? "User blocked" : "User unblocked");
  } catch (error: any) {
    const m = msg(error, "Failed to update user");
    yield put(adminActions.blockUserFailure(m));
    toast.error(m);
  }
}

// ── KYC ──────────────────────────────────────────────────────────────────────
function* fetchKycsSaga() {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(getAllKycsAPI);
    
    // Backend might return { kycs: [], pagination: {} } or just []
    // Extract the array safely
    const data = res.data.data;
    const kycs = Array.isArray(data) ? data : (data?.kycs ?? data?.data ?? []);
    
    yield put(adminActions.fetchKycsSuccess(kycs));
  } catch (error: any) {
    yield put(adminActions.fetchKycsFailure(msg(error, "Failed to load KYC applications")));
  }
}
function* verifyKycSaga(action: PayloadAction<{ id: string; status: "APPROVED" | "REJECTED"; rejectionReason?: string }>) {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(
      verifyKycAPI,
      action.payload.id,
      { status: action.payload.status, rejectionReason: action.payload.rejectionReason }
    );
    yield put(adminActions.verifyKycSuccess(res.data.data));
    toast.success(`KYC ${action.payload.status === "APPROVED" ? "approved" : "rejected"}`);
  } catch (error: any) {
    const m = msg(error, "Failed to update KYC");
    yield put(adminActions.verifyKycFailure(m));
    toast.error(m);
  }
}

// ── Ads ───────────────────────────────────────────────────────────────────────
function* fetchAdsSaga() {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(getAllAdsAdminAPI);
    yield put(adminActions.fetchAdsSuccess(res.data.data));
  } catch (error: any) {
    yield put(adminActions.fetchAdsFailure(msg(error, "Failed to load advertisements")));
  }
}

function* updateAdStatusSaga(action: PayloadAction<{ adId: string; action: "APPROVE" | "REJECT" | "DISABLE"; rejectionReason?: string }>) {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(
      updateAdStatusAdminAPI,
      action.payload.adId,
      { action: action.payload.action, rejectionReason: action.payload.rejectionReason }
    );
    yield put(adminActions.updateAdStatusSuccess(res.data.data));
    toast.success(`Ad ${action.payload.action.toLowerCase()}d successfully`);
  } catch (error: any) {
    const m = msg(error, "Failed to update ad status");
    yield put(adminActions.updateAdStatusFailure(m));
    toast.error(m);
  }
}

// ── Deals ─────────────────────────────────────────────────────────────────────
function* fetchDealsSaga() {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(getAllDealsAdminAPI);
    yield put(adminActions.fetchDealsSuccess(res.data.data));
  } catch (error: any) {
    yield put(adminActions.fetchDealsFailure(msg(error, "Failed to load deals")));
  }
}

function* resolveDisputeSaga(action: PayloadAction<{ id: string; resolution: "REFUND_BUYER" | "RELEASE_SELLER"; adminNote: string }>) {
  try {
    console.log("→ Resolving dispute:", action.payload); // add this
    const res = yield call(
      resolveDisputeAPI,
      action.payload.id,
      { resolution: action.payload.resolution, adminNote: action.payload.adminNote }
    );
    yield put(adminActions.resolveDisputeSuccess(res.data.data));
    toast.success("Dispute resolved successfully");
  } catch (error: any) {
    console.log("→ Resolve error:", error?.response); // add this
    const m = msg(error, "Failed to resolve dispute");
    yield put(adminActions.resolveDisputeFailure(m));
    toast.error(m);
  }
}

// ── Auctions ──────────────────────────────────────────────────────────────────
function* fetchAuctionsSaga() {
  try {
    const res: AxiosResponse<{ data: any }> = yield call(getAllAuctionsAdminAPI);
    yield put(adminActions.fetchAuctionsSuccess(res.data.data));
  } catch (error: any) {
    yield put(adminActions.fetchAuctionsFailure(msg(error, "Failed to load auctions")));
  }
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function* adminSaga() {
  yield takeLatest(adminActions.fetchStatsRequest.type,       fetchStatsSaga);
  yield takeLatest(adminActions.fetchUsersRequest.type,       fetchUsersSaga);
  yield takeLatest(adminActions.blockUserRequest.type,        blockUserSaga);
  yield takeLatest(adminActions.fetchKycsRequest.type,        fetchKycsSaga);
  yield takeLatest(adminActions.verifyKycRequest.type,        verifyKycSaga);
  yield takeLatest(adminActions.fetchAdsRequest.type,         fetchAdsSaga);
  yield takeLatest(adminActions.updateAdStatusRequest.type,   updateAdStatusSaga);
  yield takeLatest(adminActions.fetchDealsRequest.type,       fetchDealsSaga);
  yield takeLatest(adminActions.resolveDisputeRequest.type,   resolveDisputeSaga);
  yield takeLatest(adminActions.fetchAuctionsRequest.type,    fetchAuctionsSaga);
}