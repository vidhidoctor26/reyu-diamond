import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import kycReducer from "./slices/kycSlice";
import inventoryReducer from "./slices/inventorySlice";
import auctionReducer from "./slices/auctionSlice";
import bidReducer from "./slices/bidSlice";
import dealReducer from "./slices/dealSlice";
import chatReducer from "./slices/chatSlice";
import notificationReducer from "./slices/notificationsSlice";
import ratingsReducer from "./slices/ratingSlice";
import badgeReducer from "./slices/badgeSlice";
import advertisementReducer from "./slices/advertisementSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  inventory: inventoryReducer,
  auction: auctionReducer,
  bid: bidReducer,
  deal: dealReducer,
  chat: chatReducer,
  notifications: notificationReducer,
  rating: ratingsReducer,
  badge: badgeReducer,
  advertisement: advertisementReducer, // ← was "adcertisement"
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;