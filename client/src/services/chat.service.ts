import api from "@/lib/api";
import { ENDPOINTS } from "@/services/endpoints";

export const getConversationsAPI = () =>
  api.get(ENDPOINTS.CHAT.LIST);

export const getMessagesAPI = (conversationId: string, page = 1, limit = 50) =>
  api.get(ENDPOINTS.CHAT.GET_MESSAGES(conversationId), { params: { page, limit } });

export const initiateConversationAPI = (payload: {
  participantId: string;
  contextType: "REQUIREMENT" | "DEAL";
  contextId: string;
}) => api.post(ENDPOINTS.CHAT.INITIATE, payload);

export const markAsReadAPI = (conversationId: string) =>
  api.patch(ENDPOINTS.CHAT.MARK_READ(conversationId));