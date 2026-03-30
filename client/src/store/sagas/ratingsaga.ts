import { call, put, takeLatest } from "redux-saga/effects";
import { ratingActions } from "../slices/ratingSlice";
import {
  createRatingAPI,
  getRatingsByUserAPI,
  getMyRatingsAPI,
} from "@/services/rating.service";

function* submitRatingSaga(action: any): any {
  try {
    const { userId, onSuccess, onError, ...payload } = action.payload;
    const response = yield call(createRatingAPI, userId, payload);
    yield put(ratingActions.submitRatingSuccess(response.data.data));
    if (onSuccess) onSuccess();
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    yield put(ratingActions.submitRatingFailure(msg));
    if (action.payload.onError) action.payload.onError(msg);
  }
}

function* fetchUserRatingsSaga(action: any): any {
  try {
    const { userId, onSuccess, onError } = action.payload;
    const response = yield call(getRatingsByUserAPI, userId);
    yield put(ratingActions.fetchUserRatingsSuccess(response.data.data));
    if (onSuccess) onSuccess();
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    yield put(ratingActions.fetchUserRatingsFailure(msg));
    if (action.payload.onError) action.payload.onError(msg);
  }
}

function* fetchMyRatingsSaga(): any {
  try {
    const response = yield call(getMyRatingsAPI);
    yield put(ratingActions.fetchMyRatingsSuccess(response.data.data));
  } catch (error: any) {
    yield put(
      ratingActions.fetchMyRatingsFailure(
        error?.response?.data?.message || error.message
      )
    );
  }
}

export default function* ratingSaga() {
  yield takeLatest(ratingActions.submitRatingRequest.type, submitRatingSaga);
  yield takeLatest(ratingActions.fetchUserRatingsRequest.type, fetchUserRatingsSaga);
  yield takeLatest(ratingActions.fetchMyRatingsRequest.type, fetchMyRatingsSaga);
}