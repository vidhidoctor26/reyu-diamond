import api from "@/lib/api";
import { ENDPOINTS } from "@/services/endpoints";

// CREATE AUCTION
export const createAuctionAPI = (data: {
  inventoryId: string;
  basePrice: number;
  startDate: string;
  endDate: string;
}) => {
  return api.post(ENDPOINTS.AUCTIONS.CREATE, data);
};

// FETCH ALL AUCTIONS (MARKETPLACE)
export const fetchAuctionsAPI = (params?: any) => {
  return api.get(ENDPOINTS.AUCTIONS.LIST, { params });
};

// FETCH SINGLE AUCTION
export const fetchAuctionByIdAPI = (id: string) => {
  return api.get(ENDPOINTS.AUCTIONS.GET_ONE(id));
};

// UPDATE AUCTION
export const updateAuctionAPI = (id: string, data: any) => {
  return api.put(ENDPOINTS.AUCTIONS.UPDATE(id), data);
};

// DELETE AUCTION
export const deleteAuctionAPI = (id: string) => {
  return api.delete(ENDPOINTS.AUCTIONS.DELETE(id));
};

// UPDATE STATUS (START / END / CANCEL)
export const updateAuctionStatusAPI = (id: string, action: string) => {
  return api.patch(ENDPOINTS.AUCTIONS.UPDATE_STATUS(id), { action });
};

// AUTO CLOSE
export const autoCloseAuctionAPI = (id: string) => {
  return api.post(ENDPOINTS.AUCTIONS.AUTO_CLOSE(id));
};