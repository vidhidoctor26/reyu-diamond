import { io, Socket } from "socket.io-client";


let socket: Socket | null = null;


export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
};

export const connectSocket = (token: string) => {
  const s = getSocket();
  s.auth = { token };
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};

export default getSocket;