import { call, put, takeLatest } from "redux-saga/effects";
import { badgeActions } from "../slices/badgeSlice";
import { getBadgesByUserAPI, getMyBadgesAPI } from "@/services/badge.service";

function* fetchUserBadgesSaga(action: any): any {
  try {
    const response = yield call(getBadgesByUserAPI, action.payload.userId);
    yield put(badgeActions.fetchUserBadgesSuccess(response.data.data));
  } catch (error: any) {
    yield put(
      badgeActions.fetchUserBadgesFailure(
        error?.response?.data?.message || error.message
      )
    );
  }
}

function* fetchMyBadgesSaga(): any {
  try {
    const response = yield call(getMyBadgesAPI);
    yield put(badgeActions.fetchMyBadgesSuccess(response.data.data));
  } catch (error: any) {
    yield put(
      badgeActions.fetchMyBadgesFailure(
        error?.response?.data?.message || error.message
      )
    );
  }
}

export default function* badgeSaga() {
  yield takeLatest(badgeActions.fetchUserBadgesRequest.type, fetchUserBadgesSaga);
  yield takeLatest(badgeActions.fetchMyBadgesRequest.type, fetchMyBadgesSaga);
}