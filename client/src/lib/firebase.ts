import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAXqs2wsbRqhoLToXSeS9isqIvrfPd_ub4",
  authDomain: "reyu-diamond-app-bf9f0.firebaseapp.com",
  projectId: "reyu-diamond-app-bf9f0", // 🔥 MUST EXIST
  storageBucket: "reyu-diamond-app-bf9f0.appspot.com",
  messagingSenderId: "649004543118",
  appId: "1:649004543118:web:b69ca0ce51f2841f7c6ddf"
};

const app = initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;