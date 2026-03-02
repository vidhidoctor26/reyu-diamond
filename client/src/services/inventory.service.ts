import api from "@/lib/api";
import { ENDPOINTS } from "@/services/endpoints";

export const InventoryService = {
  list: (params?: any) => api.get(ENDPOINTS.INVENTORY.LIST, { params }),

  getById: (id: string) => api.get(ENDPOINTS.INVENTORY.GET_ONE(id)),

  create: (payload: any) => api.post(ENDPOINTS.INVENTORY.CREATE, payload),

  update: (id: string, payload: any) =>
    api.put(ENDPOINTS.INVENTORY.UPDATE(id), payload),

  delete: (id: string) => api.delete(ENDPOINTS.INVENTORY.DELETE(id)),

  addMedia: (id: string, formData: FormData) =>
    api.post(ENDPOINTS.INVENTORY.ADD_MEDIA(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  replaceMedia: (id: string, formData: FormData) =>
    api.put(ENDPOINTS.INVENTORY.REPLACE_MEDIA(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  removeMedia: (id: string, payload: any) =>
    api.delete(ENDPOINTS.INVENTORY.REMOVE_MEDIA(id), { data: payload }),
};
