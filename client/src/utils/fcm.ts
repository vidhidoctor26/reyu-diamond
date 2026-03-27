import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebase";
import api from "@/lib/api"; // ✅ Use the correct alias from your user.service
import { ENDPOINTS } from "../services/endpoints"; // ✅ Import your endpoints

export const requestFcmToken = async () => {
  try {
    // 1. Check browser support
    if (!("Notification" in window)) {
      console.info("This browser does not support desktop notifications");
      return;
    }

    // 2. Request Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    // 3. Get Token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      // 4. Send to backend using your mapped API
      await api.post(ENDPOINTS.NOTIFICATIONS.SAVE_FCM_TOKEN, { fcmToken: token });
      console.log("FCM Token saved to server");
    }
  } catch (error) {
    console.error("Error setting up FCM:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });