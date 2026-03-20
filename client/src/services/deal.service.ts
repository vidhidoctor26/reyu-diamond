import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

export const fetchDealsAPI = () =>
  api.get(ENDPOINTS.DEALS.LIST);

export const fetchDealByIdAPI = (id: string) =>
  api.get(ENDPOINTS.DEALS.GET_ONE(id));

export const markShippedAPI = (id: string, data: {
  courier: string;
  trackingNumber: string;
  note?: string;
}) => api.patch(ENDPOINTS.DEALS.SHIP(id), data);

export const confirmDeliveredAPI = (id: string, data?: { note?: string }) =>
  api.patch(ENDPOINTS.DEALS.DELIVER(id), data);

export const cancelDealAPI = (id: string, data?: { note?: string }) =>
  api.patch(ENDPOINTS.DEALS.CANCEL(id), data);

export const raiseDisputeAPI = (id: string, data: { reason: string }) =>
  api.patch(ENDPOINTS.DEALS.DISPUTE(id), data);

export const generatePdfAPI = (id: string) =>
  api.post(ENDPOINTS.DEALS.GENERATE_PDF(id));