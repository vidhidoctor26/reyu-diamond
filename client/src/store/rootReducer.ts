import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import kycReducer from "./slices/kycSlice";
import inventoryReducer from "./slices/inventorySlice";
import auctionReducer from "./slices/auctionSlice";
import listingReducer from "./slices/listingsSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  inventory: inventoryReducer,
  auction: auctionReducer,
  listings: listingReducer,
});

export type RootState = ReturnType<typeof rootReducer>; // ✅ REQUIRED
export default rootReducer;
