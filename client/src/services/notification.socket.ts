import { getSocket } from "@/lib/socket";
import { fetchNotificationsRequest, fetchUnreadCount } from "@/store/slices/notificationsSlice";

let isInitialized = false;

export const initNotificationSocket = (dispatch: any, userId?: string) => {
  const socket = getSocket();
  if (!socket || isInitialized) return;
  isInitialized = true;

  // Join user's room when connected (handles reconnects too)
  const handleConnect = () => {
    console.log("✅ Notification socket connected:", socket.id);
    if (userId) {
      socket.emit("join", userId);
    }
  };

  const handleDisconnect = () => {
    console.log("❌ Notification socket disconnected");
    isInitialized = false; // ✅ reset so it re-initializes on reconnect/re-login
  };

  const handleNewNotification = (notification: any) => {
    console.log("🔥 New Notification:", notification);
    dispatch(fetchNotificationsRequest());  // ✅ typed action
    dispatch(fetchUnreadCount());           // ✅ typed action
  };

  socket.off("connect", handleConnect);
  socket.off("disconnect", handleDisconnect);
  socket.off("new_notification", handleNewNotification);

  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("new_notification", handleNewNotification);

  // If already connected when this runs, join room immediately
  if (socket.connected && userId) {
    socket.emit("join", userId);
  }
};

export const resetNotificationSocket = () => {
  isInitialized = false;
};