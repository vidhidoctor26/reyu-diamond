import { call, put, takeLatest } from "redux-saga/effects";
import { createAuction } from "@/services/auction.service";
import { auctionActions } from "../slices/auctionSlice";

function* createAuctionSaga(action: ReturnType<typeof auctionActions.createAuctionRequest>): any {
  try {
    const { inventoryId, basePrice, startDate, endDate, onSuccess } =
      action.payload;

    yield call(createAuction, {
  inventoryId,
  basePrice,
  startDate,
  endDate,
});

    yield put(auctionActions.createAuctionSuccess());

    if (onSuccess) onSuccess();
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Auction creation failed";

    yield put(auctionActions.createAuctionFailure(message));

    if (action.payload.onError) {
      action.payload.onError(message);
    }
  }
}

export default function* auctionSaga() {
  yield takeLatest(
    auctionActions.createAuctionRequest.type,
    createAuctionSaga
  );
}