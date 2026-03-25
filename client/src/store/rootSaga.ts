import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import kycSaga from "./sagas/kycSaga";
import { inventorySaga } from "./sagas/inventorySaga";
import auctionSaga from "./sagas/auctionSaga";
import bidSaga from "./sagas/bidSaga";
import dealSaga from "./sagas/dealSaga";
import chatSaga from "./sagas/chatSaga";


export default function* rootSaga() {
  yield all([
    authSaga(),
    kycSaga(),
    inventorySaga(),
    auctionSaga(),
    bidSaga(),
    dealSaga(),
    chatSaga(),
  ]);
}
