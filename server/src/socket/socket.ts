import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import * as ChatService from "../services/chat.service";

let ioInstance: Server | null = null;

// ======================
// INIT SOCKET
// ======================
export const initSocket = (server: any) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setupSocket(ioInstance);

  return ioInstance;
};

// ======================
// GET IO INSTANCE
// ======================
export const getIO = (): Server => {
  if (!ioInstance) {
    throw new Error("❌ Socket.io not initialized");
  }
  return ioInstance;
};

// ======================
// MAIN SOCKET SETUP
// ======================
const setupSocket = (io: Server) => {
  // ======================
  // AUTH MIDDLEWARE
  // ======================
  io.use((socket: any, next) => {
    try {
      const token = socket.handshake.auth?.token;

      console.log("🔐 Incoming token:", token);

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      socket.user = decoded;

      next();
    } catch (err: any) {
      console.error("❌ AUTH ERROR:", err.message);
      next(new Error("Invalid token"));
    }
  });

  // ======================
  // CONNECTION
  // ======================
  io.on("connection", (socket: any) => {
    const userId = socket.user?.userId || socket.user?.id;

    if (!userId) {
      console.error("❌ No userId found in token");
      socket.disconnect();
      return;
    }

    console.log("🔥 SOCKET CONNECTED:", socket.id, "USER:", userId);

    // Join personal room
    socket.join(userId.toString());

    // ======================
    // JOIN CONVERSATION
    // ======================
    socket.on("joinconversation", (conversationId: string) => {
      console.log("📥 JOIN ROOM:", conversationId);
      socket.join(conversationId);
    });

    // ======================
    // SEND MESSAGE
    // ======================
    socket.on("sendMessage", async (data: any) => {
      console.log("📥 MESSAGE RECEIVED:", data);

      const { conversationId, text, tempId } = data;

      if (!conversationId || !text) {
        return socket.emit("socketError", {
          success: false,
          message: "Missing conversationId or text",
        });
      }

      try {
        const msg = await ChatService.sendMessageService({
          conversationId,
          senderId: userId,
          text,
        });

        // Send message to others in room
        socket.to(conversationId).emit("newMessage", msg);

        // Acknowledge sender
        socket.emit("messageSent", {
          success: true,
          messageId: msg._id,
          tempId,
          status: "SENT",
        });

      } catch (err: any) {
        console.error("❌ SEND ERROR:", err.message);

        socket.emit("socketError", {
          success: false,
          message: err.message || "Message sending failed",
        });
      }
    });

    // ======================
    // DISCONNECT
    // ======================
    socket.on("disconnect", (reason: string) => {
      console.log("❌ DISCONNECTED:", socket.id, "Reason:", reason);
    });
  });

  // ======================
  // ENGINE ERROR HANDLING
  // ======================
  io.engine.on("connection_error", (err: any) => {
    console.error("🚨 ENGINE ERROR:", err.message);
  });
};