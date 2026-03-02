import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import kycSaga from "./sagas/kycSaga";
import { inventorySaga } from "./sagas/inventorySaga";
import auctionSaga from "./sagas/auctionSaga";
import { listingsSaga } from "./sagas/listingsSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    kycSaga(),
    inventorySaga(),
    auctionSaga(),
    listingsSaga(),
  ]);
}
