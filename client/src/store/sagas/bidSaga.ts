import { call, put, takeLatest } from "redux-saga/effects";
import { bidActions } from "../slices/bidSlice";
import {
  placeBidAPI,
  getMyBidAPI,
  getHighestBidAPI,
  getBidsByAuctionAPI,
  getAllMyBidsAPI,
  getBidsReceivedAPI,
  updateBidStatusAPI,
} from "@/services/bid.service";

function* placeBidSaga(action: any): any {
  try {
    const { onSuccess, onError, ...data } = action.payload;
    console.log("🚀 PLACING BID:", data);
    
    const response = yield call(placeBidAPI, data);
    console.log("✅ BID RESPONSE:", response.data);
    
    yield put(bidActions.placeBidSuccess(response.data.data));
    if (onSuccess) onSuccess();
  } catch (error: any) {
    console.log("❌ STATUS:", error?.response?.status);
    console.log("❌ MESSAGE:", error?.response?.data?.message);
    console.log("❌ FULL ERROR DATA:", error?.response?.data);
    
    const message = error?.response?.data?.message || error.message;
    yield put(bidActions.placeBidFailure(message));
    if (action.payload.onError) action.payload.onError(message);
  }
}

function* fetchMyBidSaga(action: any): any {
  try {
    const response = yield call(getMyBidAPI, action.payload);
    yield put(bidActions.fetchMyBidSuccess(response.data.data));
  } catch (error: any) {
    yield put(bidActions.fetchMyBidFailure(error?.response?.data?.message || error.message));
  }
}

function* fetchHighestBidSaga(action: any): any {
  try {
    const response = yield call(getHighestBidAPI, action.payload);
    yield put(bidActions.fetchHighestBidSuccess(response.data.data));
  } catch (error: any) {
    yield put(bidActions.fetchHighestBidFailure(error?.response?.data?.message || error.message));
  }
}

function* fetchAuctionBidsSaga(action: any): any {
  try {
    const response = yield call(getBidsByAuctionAPI, action.payload);
    yield put(bidActions.fetchAuctionBidsSuccess(response.data.data));
  } catch (error: any) {
    yield put(bidActions.fetchAuctionBidsFailure(error?.response?.data?.message || error.message));
  }
}

function* fetchAllMyBidsSaga(): any {
  try {
    const response = yield call(getAllMyBidsAPI);
    yield put(bidActions.fetchAllMyBidsSuccess(response.data.data));
  } catch (error: any) {
    yield put(bidActions.fetchAllMyBidsFailure(
      error?.response?.data?.message || error.message
    ));
  }
}

function* fetchBidsReceivedSaga(): any {
  try {
    const response = yield call(getBidsReceivedAPI);
    yield put(bidActions.fetchBidsReceivedSuccess(response.data.data));
  } catch (error: any) {
    yield put(bidActions.fetchBidsReceivedFailure(
      error?.response?.data?.message || error.message
    ));
  }
}

function* updateBidSaga(action: any): any {
  const { bidId, action: bidAction, onSuccess, onError } = action.payload || {};
  try {
    console.log("🚀 UPDATING BID:", { bidId, bidAction });

    const response = yield call(updateBidStatusAPI, bidId, bidAction);

    console.log("✅ UPDATE RESPONSE:", response.data);

    yield put(bidActions.updateBidSuccess(response.data.data));

    if (onSuccess) onSuccess(response.data.data);

  } catch (error: any) {
    console.log("❌ UPDATE ERROR:", error?.response?.data);

    const message = error?.response?.data?.message || error.message;

    yield put(bidActions.updateBidFailure(message));

    if (onError) onError(message);
  }
}


// Add to watcher


export default function* bidSaga() {
  yield takeLatest(bidActions.placeBidRequest.type,         placeBidSaga);
  yield takeLatest(bidActions.fetchMyBidRequest.type,       fetchMyBidSaga);
  yield takeLatest(bidActions.fetchHighestBidRequest.type,  fetchHighestBidSaga);
  yield takeLatest(bidActions.fetchAuctionBidsRequest.type, fetchAuctionBidsSaga);
  yield takeLatest(bidActions.fetchAllMyBidsRequest.type, fetchAllMyBidsSaga);
  yield takeLatest(bidActions.fetchBidsReceivedRequest.type, fetchBidsReceivedSaga);
  yield takeLatest(bidActions.updateBidRequest.type,updateBidSaga);
}