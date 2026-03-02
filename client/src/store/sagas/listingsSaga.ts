import { call, put, takeLatest } from "redux-saga/effects";
import { listingsService } from "@/services/listings.service";
import {
  fetchMyListingsRequest,
  fetchMyListingsSuccess,
  fetchMyListingsFailure,
} from "../slices/listingsSlice";

function* fetchMyListingsWorker(): any {
  try {
    const data = yield call(listingsService.getMyListings);
    yield put(fetchMyListingsSuccess(data));
  } catch (error: any) {
    yield put(
      fetchMyListingsFailure(
        error.message || "Failed to fetch listings"
      )
    );
  }
}

export function* listingsSaga() {
  yield takeLatest(
    fetchMyListingsRequest.type,
    fetchMyListingsWorker
  );
}