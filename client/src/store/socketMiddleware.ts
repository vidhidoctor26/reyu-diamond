import type { Middleware } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { chatActions } from "./slices/chatSlice";
import { authActions } from "./slices/authSlice";

export const socketMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  // Connect socket on login success
  if (
    action.type === authActions.loginSuccess.type ||
    action.type === authActions.hydrateSessionSuccess.type ||
    action.type === "auth/loadUserSuccess"
  ) {
    const token = store.getState().auth.token;
    if (token) {
      const socket = connectSocket(token);

      socket.on("newMessage", (message: any) => {
        store.dispatch(chatActions.receiveMessage(message));
        // increment unread if not in that conversation
        const selectedId = store.getState().chat?.selectedConversationId;
        if (message.conversationId !== selectedId) {
          store.dispatch(chatActions.incrementUnread(message.conversationId));
        }
      });

      socket.on("messagesRead", ({ conversationId, userId }: any) => {
        store.dispatch(chatActions.markConversationRead({ conversationId, userId }));
      });

      socket.on("socketError", (err: any) => {
        console.error("Socket error:", err.message);
      });
    }
  }

  // Disconnect on logout
  if (action.type === authActions.logoutSuccess?.type || action.type === "auth/logoutRequest") {
    disconnectSocket();
    store.dispatch(chatActions.clearChat());
  }

  // Auto-join conversation room when selected
  if (action.type === chatActions.selectConversation.type) {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("joinconversation", action.payload);
    }
  }

  // Emit markAsRead via socket when conversation selected
  if (action.type === chatActions.fetchMessagesSuccess.type) {
    const socket = getSocket();
    const conversationId = action.payload.conversationId;
    const userId = store.getState().auth.user?._id;
    if (socket?.connected && conversationId) {
      socket.emit("markAsRead", { conversationId });
      store.dispatch(chatActions.markConversationRead({ conversationId, userId }));
    }
  }

  return result;
};