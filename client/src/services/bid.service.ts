import api from "@/lib/api";

export const placeBidAPI = (data: { auctionId: string; bidAmount: number }) =>
  api.post("/bids", data);

export const getMyBidAPI = (auctionId: string) =>
  api.get(`/bids/my/${auctionId}`);

export const getHighestBidAPI = (auctionId: string) =>
  api.get(`/bids/auction/${auctionId}/highest`);

export const getBidsByAuctionAPI = (auctionId: string) =>
  api.get(`/bids/auction/${auctionId}`);