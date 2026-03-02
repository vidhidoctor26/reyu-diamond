import api from "@/lib/api";
import { ENDPOINTS } from "@/services/endpoints";

export const PreferenceService = {
  create: (payload: any) =>
    api.post(ENDPOINTS.REQUIREMENTS.CREATE, payload),

  update: (id: string, payload: any) =>
    api.put(ENDPOINTS.REQUIREMENTS.UPDATE(id), payload),

  getOne: (id: string) =>
    api.get(ENDPOINTS.REQUIREMENTS.GET_ONE(id)),

  delete: (id: string) =>
    api.delete(ENDPOINTS.REQUIREMENTS.DELETE(id)),
};