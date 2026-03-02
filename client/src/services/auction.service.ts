import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

/* ---------------- CREATE AUCTION ---------------- */

export const createAuction = (data: {
  inventoryId: string;
  basePrice: number;
  startDate: string;
  endDate: string;
}) =>
  api.post(ENDPOINTS.AUCTIONS.CREATE, data);

/* ---------------- GET ALL AUCTIONS ---------------- */

export const getAuctions = (params?: {
  status?: string;
  sellerId?: string;
  inventoryId?: string;
}) =>
  api.get(ENDPOINTS.AUCTIONS.LIST, { params });

/* ---------------- GET ONE AUCTION ---------------- */

export const getAuctionById = (id: string) =>
  api.get(ENDPOINTS.AUCTIONS.GET_ONE(id));

/* ---------------- UPDATE AUCTION ---------------- */

export const updateAuction = (
  id: string,
  data: {
    basePrice?: number;
    startDate?: string;
    endDate?: string;
  }
) =>
  api.put(ENDPOINTS.AUCTIONS.UPDATE(id), data);

/* ---------------- UPDATE STATUS ---------------- */

export const updateAuctionStatus = (
  id: string,
  action: string
) =>
  api.patch(ENDPOINTS.AUCTIONS.UPDATE_STATUS(id), {
    action,
  });

/* ---------------- AUTO CLOSE ---------------- */

export const autoCloseAuction = (id: string) =>
  api.patch(ENDPOINTS.AUCTIONS.AUTO_CLOSE(id));

/* ---------------- DELETE ---------------- */

export const deleteAuction = (id: string) =>
  api.delete(ENDPOINTS.AUCTIONS.DELETE(id));