import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Conversation from "../models/Chat.conversation.model";
import Message from "../models/Chat.message.model";
import { CustomError } from "../utils/customError.utility";

dotenv.config();

export const setupSocket = (io: Server) => {
  // JWT Middleware
  io.use((socket: any, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new CustomError("Unauthorized : Token Missing", 401));
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new CustomError("Unauthorized : Invalid Token", 401));
    }
  });

  io.on("connection", (socket: any) => {
    const userId = socket.user?.id || socket.user?._id;
    console.log("User Connected:", userId);

    // Join personal room (for direct notifications)
    socket.join(userId.toString());

    /**
     * JOIN CONVERSATION ROOM
     */
    socket.on("joinConversation", async (conversationId: string) => {
      try {
        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          throw new CustomError("Invalid conversationId", 400);
        }

        const conversation: any = await Conversation.findById(conversationId);
        if (!conversation) throw new CustomError("Conversation not found", 404);

        const isParticipant = conversation.participantIds.some((id: any) =>
          id.equals(userId)
        );
        if (!isParticipant) throw new CustomError("Not allowed to join", 403);

        socket.join(conversationId);
        console.log(`User ${userId} joined conversation ${conversationId}`);

        socket.emit("joinedConversation", { success: true, conversationId });

        // ✅ When user joins a room, mark all unread messages as DELIVERED
        // (they are now online and in the conversation)
        const undelivered = await Message.updateMany(
          {
            conversationId: new mongoose.Types.ObjectId(conversationId),
            senderId: { $ne: new mongoose.Types.ObjectId(userId) },
            status: "SENT",
          },
          {
            $set: {
              status: "DELIVERED",
              deliveredAt: new Date(),
            },
          }
        );

        if (undelivered.modifiedCount > 0) {
          // Notify the sender their messages were delivered
          io.to(conversationId).emit("messagesDelivered", {
            conversationId,
            deliveredTo: userId,
            deliveredAt: new Date(),
          });
        }
      } catch (error: any) {
        socket.emit("socketError", {
          success: false,
          message: error.message || "Join conversation failed",
        });
      }
    });

    /**
     * TYPING EVENT
     */
    socket.on("typing", ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit("typing", { userId, conversationId });
    });

    socket.on("stopTyping", ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit("stopTyping", { userId, conversationId });
    });

    /**
     * SEND MESSAGE
     * ✅ Saves as DELIVERED if receiver is online in the room, else SENT
     */
    socket.on(
      "sendMessage",
      async ({
        conversationId,
        text,
        attachments,
        replyToMessageId,
      }: {
        conversationId: string;
        text: string;
        attachments?: any[];
        replyToMessageId?: string;
      }) => {
        try {
          if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
            throw new CustomError("Invalid conversationId", 400);
          }
          if (!text || text.trim().length === 0) {
            throw new CustomError("Message text is required", 400);
          }

          const conversation: any = await Conversation.findById(conversationId);
          if (!conversation) throw new CustomError("Conversation not found", 404);

          const isParticipant = conversation.participantIds.some((id: any) =>
            id.equals(userId)
          );
          if (!isParticipant) throw new CustomError("Not allowed", 403);

          // ✅ Check if the receiver is currently in the room (online)
          const roomSockets = await io.in(conversationId).fetchSockets();
          const receiverId = conversation.participantIds
            .find((id: any) => id.toString() !== userId.toString())
            ?.toString();

          const isReceiverOnline = roomSockets.some(
            (s: any) =>
              (s.user?.id || s.user?._id)?.toString() === receiverId
          );

          // ✅ Set status based on receiver presence
          const messageStatus = isReceiverOnline ? "DELIVERED" : "SENT";

          const newMessage = await Message.create({
            conversationId: new mongoose.Types.ObjectId(conversationId),
            senderId: new mongoose.Types.ObjectId(userId),
            text,
            attachments: attachments || [],
            replyToMessageId: replyToMessageId
              ? new mongoose.Types.ObjectId(replyToMessageId)
              : undefined,
            status: messageStatus,
            sentAt: new Date(),
            deliveredAt: isReceiverOnline ? new Date() : undefined,
            // legacy
            from: userId,
            read: false,
          });

          // Update conversation metadata
          conversation.lastMessageText = text.substring(0, 100);
          conversation.lastMessageAt = newMessage.sentAt;
          conversation.userSettings = conversation.userSettings.map((setting: any) => {
            if (setting.userId.toString() !== userId.toString()) {
              setting.unreadCount = (setting.unreadCount || 0) + 1;
            }
            return setting;
          });
          await conversation.save();

          // ✅ Emit to all users in the conversation room
          io.to(conversationId).emit("newMessage", newMessage);

          // ✅ Send ack to sender with final status
          socket.emit("messageSent", {
            success: true,
            messageId: newMessage._id,
            status: messageStatus,
          });
        } catch (error: any) {
          socket.emit("socketError", {
            success: false,
            message: error.message || "Message sending failed",
          });
        }
      }
    );

    /**
     * MARK AS READ
     * ✅ Updates all unread messages to READ and notifies sender
     */
    socket.on(
      "markAsRead",
      async ({ conversationId }: { conversationId: string }) => {
        try {
          if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
            throw new CustomError("Invalid conversationId", 400);
          }

          const conversation: any = await Conversation.findById(conversationId);
          if (!conversation) throw new CustomError("Conversation not found", 404);

          const isParticipant = conversation.participantIds.some((id: any) =>
            id.equals(userId)
          );
          if (!isParticipant) throw new CustomError("Not allowed", 403);

          // ✅ Mark all SENT/DELIVERED messages from the other person as READ
          const result = await Message.updateMany(
            {
              conversationId: new mongoose.Types.ObjectId(conversationId),
              senderId: { $ne: new mongoose.Types.ObjectId(userId) },
              status: { $in: ["SENT", "DELIVERED"] },
            },
            {
              $set: {
                status: "READ",
                readAt: new Date(),
                read: true, // legacy
              },
            }
          );

          // Reset unreadCount for current user
          conversation.userSettings = conversation.userSettings.map((setting: any) => {
            if (setting.userId.toString() === userId.toString()) {
              setting.unreadCount = 0;
              setting.lastReadAt = new Date();
            }
            return setting;
          });
          await conversation.save();

          // ✅ Notify everyone in room (sender sees their msgs marked READ)
          io.to(conversationId).emit("messagesRead", {
            conversationId,
            readBy: userId,
            readAt: new Date(),
            count: result.modifiedCount,
          });

          socket.emit("readSuccess", { success: true, conversationId });
        } catch (error: any) {
          socket.emit("socketError", {
            success: false,
            message: error.message || "Mark read failed",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User Disconnected:", userId);
    });
  });
};