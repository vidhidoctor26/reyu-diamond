import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const rawUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000/";

    const socketUrl = rawUrl.startsWith("http")
      ? new URL(rawUrl).origin
      : rawUrl;

    socket = io(socketUrl, {
      path: "/socket.io",
      autoConnect: false,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    console.log("🆕 Socket instance created:", socketUrl);
  }

  return socket;
};

export const connectSocket = (token: string) => {
  const s = getSocket();

  console.log("🔑 Connecting socket with token");

  s.auth = { token };

  if (!s.connected) {
    s.connect();
  }

  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("🔌 Disconnecting socket");

    socket.removeAllListeners(); // 🔥 VERY IMPORTANT
    socket.disconnect();
    socket = null; // 🔥 reset instance
  }
};

export default getSocket;