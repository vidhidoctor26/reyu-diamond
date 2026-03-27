import type { Middleware } from "@reduxjs/toolkit";
import { connectSocket, getSocket, disconnectSocket } from "@/lib/socket"; // ✅ disconnectSocket added
import { chatActions } from "./slices/chatSlice";
import { authActions } from "./slices/authSlice";

let socketInitialized = false;

export const socketMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  // =========================
  // ✅ CONNECT SOCKET (ONLY ONCE)
  // =========================
  if (
    !socketInitialized &&
    (
      action.type === authActions.loginSuccess.type ||
      action.type === authActions.hydrateSessionSuccess.type ||
      action.type === "auth/loadUserSuccess"
    )
  ) {
    const token =
      store.getState().auth.token ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (!token) {
      console.warn("⚠️ No token → socket not connected");
      return result;
    }

    const socket = connectSocket(token);
    console.log("🟢 Connecting socket...");

    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("disconnect", (reason) => console.log("❌ Socket disconnected:", reason));
    socket.on("connect_error", (err) => console.error("🚨 Socket connect error:", err.message));

    const authUser = store.getState().auth.user;
    const myUserId = authUser?._id || authUser?.id;

    socket.off("newMessage");
    socket.off("messagesRead");
    socket.off("socketError");

    socket.on("newMessage", (message: any) => {
      console.log("📩 newMessage global event:", message);
      store.dispatch(chatActions.receiveMessage(message));

      const state = store.getState();
      const selectedId = state.chat?.selectedConversationId;

      if (message.conversationId !== selectedId) {
        if (myUserId) {
          store.dispatch(chatActions.incrementUnread({
            conversationId: message.conversationId,
            myId: myUserId,
          }));
        }
      } else {
        console.log("👁️ Instant Read inside open chat");
        socket.emit("markAsRead", { conversationId: message.conversationId });
      }
    });

    socket.on("messagesRead", ({ conversationId, readBy }: any) => {
      store.dispatch(chatActions.markConversationRead({ conversationId, userId: readBy }));
    });

    socket.on("socketError", (err: any) => {
      console.error("❌ Socket error:", err.message);
    });

    socketInitialized = true;
  }

  // =========================
  // ✅ DISCONNECT
  // =========================
  if (
    action.type === authActions.logoutSuccess?.type ||
    action.type === "auth/logoutRequest"
  ) {
    console.log("🔴 Disconnecting socket...");
    disconnectSocket();
    socketInitialized = false;
    store.dispatch(chatActions.clearChat());
  }

  // =========================
  // ✅ JOIN CONVERSATION
  // =========================
  if (action.type === chatActions.selectConversation.type) {
    const socket = getSocket();
    if (!socket) return result;

    console.log("📥 Joining conversation:", action.payload);

    if (socket.connected) {
      socket.emit("joinconversation", action.payload);
    } else {
      socket.once("connect", () => {
        console.log("⚡ Delayed join after connect");
        socket.emit("joinconversation", action.payload);
      });
    }
  }

  // =========================
  // ✅ MARK AS READ (optimistic UI only — REST call handled in saga)
  // =========================
  if (action.type === chatActions.fetchMessagesSuccess.type) {
    const socket = getSocket();
    const conversationId = action.payload.conversationId;
    const authUser = store.getState().auth.user;
    const myId = authUser?._id || authUser?.id;

    // ✅ Optimistic UI update — zero the badge immediately
    if (conversationId && myId) {
      store.dispatch(chatActions.markConversationRead({ conversationId, userId: myId }));
    }

    // Socket emit for real-time update to the other participant
    if (socket?.connected && conversationId) {
      console.log("👁️ Marking as read on conversation load:", conversationId);
      socket.emit("markAsRead", { conversationId });
    }
  }

  return result;
};