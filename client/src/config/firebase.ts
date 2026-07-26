import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAXqs2wsbRqhoLToXSeS9isqIvrfPd_ub4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "reyu-diamond-app-bf9f0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "reyu-diamond-app-bf9f0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "reyu-diamond-app-bf9f0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "649004543118",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:649004543118:web:b69ca0ce51f2841f7c6ddf",
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Messaging safely
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;