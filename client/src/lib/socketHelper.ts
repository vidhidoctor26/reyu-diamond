import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";

let isConnecting = false;

export const ensureSocketConnected = async (): Promise<Socket> => {
  const s = getSocket();

  if (s.connected) {
    console.log("⚡ Already connected:", s.id);
    return s;
  }

  if (isConnecting) {
    return new Promise((resolve) => {
      s.once("connect", () => resolve(s));
    });
  }

  isConnecting = true;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      isConnecting = false;
      reject(new Error("Timeout"));
    }, 8000);

    s.once("connect", () => {
      clearTimeout(timeout);
      isConnecting = false;
      console.log("🟢 Connected:", s.id);
      resolve(s);
    });

    s.once("connect_error", (err) => {
      clearTimeout(timeout);
      isConnecting = false;
      reject(err);
    });

    console.log("🚀 Connecting...");
    s.connect();
  });
};