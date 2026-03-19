import { call, put, takeLatest } from "redux-saga/effects";
import { auctionActions } from "../slices/auctionSlice";
import {
  fetchAuctionsAPI,
  createAuctionAPI,
  fetchAuctionByIdAPI,
} from "@/services/auction.service";

function* fetchAuctionsSaga(action: any): any {
  try {
    const response = yield call(fetchAuctionsAPI, action.payload);
    // Backend structure: { success: true, data: [...] }
    const auctions = response.data.data; 
    yield put(auctionActions.fetchAuctionsSuccess(auctions));
  } catch (error: any) {
    yield put(
      auctionActions.fetchAuctionsFailure(
        error?.response?.data?.message || error.message
      )
    );
  }
}

function* fetchMyAuctionsSaga(action: any): any {
  try {
    const response = yield call(fetchAuctionsAPI, action.payload);

    const auctions = response.data.data;

    yield put(auctionActions.fetchMyAuctionsSuccess(auctions));
  } catch (error: any) {
    yield put(
      auctionActions.fetchMyAuctionsFailure(
        error?.response?.data?.message || error.message
      )
    );
  }
}

function* fetchAuctionByIdSaga(action: any): any {
  try {
    const response = yield call(fetchAuctionByIdAPI, action.payload);
    // Backend structure: { success: true, data: { ... } }
    yield put(auctionActions.fetchAuctionByIdSuccess(response.data.data));
  } catch (error: any) {
    yield put(
      auctionActions.fetchAuctionByIdFailure(
        error?.response?.data?.message || error.message
      )
    );
  }
}

function* createAuctionSaga(action: any): any {
  try {
    const { onSuccess, onError, ...data } = action.payload;
    const response = yield call(createAuctionAPI, data);
    yield put(auctionActions.createAuctionSuccess(response.data.data));
    if (onSuccess) onSuccess();
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message;
    yield put(auctionActions.createAuctionFailure(message));
    if (action.payload.onError) action.payload.onError(message);
  }
}

export default function* auctionSaga() {
  yield takeLatest(auctionActions.fetchAuctionsRequest.type, fetchAuctionsSaga);
  yield takeLatest(auctionActions.fetchAuctionByIdRequest.type, fetchAuctionByIdSaga);
  yield takeLatest(auctionActions.createAuctionRequest.type, createAuctionSaga);
  yield takeLatest(auctionActions.fetchMyAuctionsRequest.type,fetchMyAuctionsSaga);
}