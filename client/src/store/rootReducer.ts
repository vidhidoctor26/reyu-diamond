import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import kycReducer from "./slices/kycSlice";
import inventoryReducer from "./slices/inventorySlice";
import auctionReducer from "./slices/auctionSlice";
import bidReducer from "./slices/bidSlice";
import dealReducer from "./slices/dealSlice";
import chatReducer from "./slices/chatSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  inventory: inventoryReducer,
  auction: auctionReducer,
  bid: bidReducer,
  deal: dealReducer,
  chat: chatReducer,
});

export type RootState = ReturnType<typeof rootReducer>; // ✅ REQUIRED
export default rootReducer;
