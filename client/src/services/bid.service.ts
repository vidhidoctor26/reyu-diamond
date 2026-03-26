import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

export const placeBidAPI = (data: { auctionId: string; bidAmount: number }) =>
  api.post(ENDPOINTS.BIDS.CREATE, data);

export const getMyBidAPI = (auctionId: string) =>
  api.get(ENDPOINTS.BIDS.GET_MY_BID(auctionId));

export const getHighestBidAPI = (auctionId: string) =>
  api.get(ENDPOINTS.BIDS.GET_HIGHEST(auctionId));

export const getBidsByAuctionAPI = (auctionId: string) =>
  api.get(ENDPOINTS.BIDS.GET_BY_AUCTION(auctionId));

export const getAllMyBidsAPI = () =>
  api.get(ENDPOINTS.BIDS.GET_ALL_MY_BIDS);

export const getBidsReceivedAPI = () =>
  api.get(ENDPOINTS.BIDS.GET_BIDS_RECEIVED);

export const updateBidStatusAPI = (bidId: string, action: string) =>
  api.patch(`/bids/${bidId}/status`, { action });
