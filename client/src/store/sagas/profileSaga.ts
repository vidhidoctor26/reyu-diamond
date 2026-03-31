// redux/sagas/profile.saga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from "../slices/profileSlice";

import {
  getUserProfileAPI,
  updateUserProfileAPI,
} from "@/services/profile.service";

// FETCH PROFILE
function* fetchProfileSaga(): any {
  try {
    const response = yield call(getUserProfileAPI);
    yield put(fetchProfileSuccess(response.data));
  } catch (error: any) {
    yield put(fetchProfileFailure(error.message));
  }
}

// UPDATE PROFILE
function* updateProfileSaga(action: any): any {
  try {
    const response = yield call(updateUserProfileAPI, action.payload);
    yield put(updateProfileSuccess(response.data));
  } catch (error: any) {
    yield put(updateProfileFailure(error.message));
  }
}

// WATCHER
export default function* profileSaga() {
  yield takeLatest(fetchProfileRequest.type, fetchProfileSaga);
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
}