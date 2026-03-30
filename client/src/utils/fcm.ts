import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";
import api from "@/lib/api";
import { ENDPOINTS } from "../services/endpoints";

export const requestFcmToken = async () => {
  try {
    // 1. Check browser support
    if (!("Notification" in window)) {
      console.info("This browser does not support desktop notifications");
      return;
    }

    // 2. Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    // 3. Get token from Firebase
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) return;

    // 4. Guard — only call backend if token is new or changed
    const savedToken = localStorage.getItem("fcm_token");
    if (savedToken === token) {
      console.info("FCM token unchanged — skipping backend save");
      return;
    }

    // 5. Save to backend
    await api.post(ENDPOINTS.NOTIFICATIONS.SAVE_FCM_TOKEN, { fcmToken: token });

    // 6. Cache token so we don't re-send on next render
    localStorage.setItem("fcm_token", token);
    console.log("FCM token saved to server");

  } catch (error) {
    console.error("Error setting up FCM:", error);
  }
};

// Call this once on logout to clear the cached token
export const clearFcmToken = () => {
  localStorage.removeItem("fcm_token");
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });