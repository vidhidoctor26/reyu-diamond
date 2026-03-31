import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import kycSaga from "./sagas/kycSaga";
import { inventorySaga } from "./sagas/inventorySaga";
import auctionSaga from "./sagas/auctionSaga";
import bidSaga from "./sagas/bidSaga";
import dealSaga from "./sagas/dealSaga";
import chatSaga from "./sagas/chatSaga";
import notificationsSaga from "./sagas/notificationsSaga";
import ratingSaga from "./sagas/ratingsaga";
import badgeSaga from "./sagas/badgeSaga";
import { advertisementSaga } from "./sagas/advertisementSaga";
import { adminSaga } from "./sagas/adminSaga";



export default function* rootSaga() {
  console.log("Saga Check:", { authSaga, inventorySaga, notificationsSaga });
  yield all([
    authSaga(),
    kycSaga(),
    inventorySaga(),
    auctionSaga(),
    bidSaga(),
    dealSaga(),
    chatSaga(),
    notificationsSaga(),
    ratingSaga(),
    badgeSaga(),
    advertisementSaga(),
    adminSaga(),

  ]);
}
