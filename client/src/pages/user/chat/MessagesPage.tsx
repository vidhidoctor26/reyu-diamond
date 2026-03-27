import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import DashboardShell from "@/components/layout/DashboardShell";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { chatActions } from "@/store/slices/chatSlice";
import type { ChatMessage } from "@/store/slices/chatSlice";

import { ensureSocketConnected } from "@/lib/socketHelper";

import ConversationList from "./components/ConversationList";
import ChatHeader from "./components/ChatHeader";
import ChatMessageBubble from "./components/ChatMessageBubble";
import ChatDateSeparator from "./components/ChatDateSeparator";
import ChatInputBar from "./components/ChatInputBar";

/* ---------------- helpers ---------------- */

const getOtherParticipant = (conv: any, myId: string) => {
  const other = conv.participantIds?.find((p: any) => {
    const id = typeof p === "string" ? p : p._id;
    return id !== myId;
  });

  if (!other) return { name: "Unknown", initial: "?" };

  const name =
    typeof other === "string"
      ? "User"
      : other.name || other.email || "User";

  return { name, initial: name.charAt(0).toUpperCase() };
};

const shouldShowDateSep = (msgs: ChatMessage[], idx: number) => {
  if (idx === 0) return true;

  return (
    new Date(msgs[idx - 1].sentAt || msgs[idx - 1].createdAt).toDateString() !==
    new Date(msgs[idx].sentAt || msgs[idx].createdAt).toDateString()
  );
};

const isGroupStart = (msgs: ChatMessage[], idx: number) => {
  if (idx === 0) return true;

  const prevId =
    typeof msgs[idx - 1].senderId === "object"
      ? (msgs[idx - 1].senderId as any)._id
      : msgs[idx - 1].senderId;

  const currId =
    typeof msgs[idx].senderId === "object"
      ? (msgs[idx].senderId as any)._id
      : msgs[idx].senderId;

  return prevId !== currId || shouldShowDateSep(msgs, idx);
};

/* ---------------- component ---------------- */

const MessagesPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const {
    conversations,
    selectedConversationId,
    messages,
    conversationsLoading,
    messagesLoading,
  } = useAppSelector((s) => s.chat);

  const { user } = useAppSelector((s) => s.auth);
  const myId = user?._id || user?.id || "";

  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  /* ---------------- INIT SOCKET ---------------- */
  useEffect(() => {
    const initSocket = async () => {
      try {
        const socket = await ensureSocketConnected();
        socketRef.current = socket;

        console.log("🟢 SOCKET CONNECTED:", socket.id);

        socket.on("disconnect", (reason: string) => {
          console.log("🔴 SOCKET DISCONNECTED:", reason);
        });
      } catch (err) {
        console.error("❌ SOCKET INIT FAILED:", err);
      }
    };

    initSocket();

    return () => {
      socketRef.current?.off();
    };
  }, []);

  /* ---------------- FETCH CONVERSATIONS ---------------- */
  useEffect(() => {
    dispatch(chatActions.fetchConversationsRequest());
  }, [dispatch]);

  /* ---------------- SELECT FROM QUERY ---------------- */
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      dispatch(chatActions.selectConversation(id));
    }
  }, [searchParams, dispatch]);

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    if (!selectedConversationId) return;

    dispatch(chatActions.fetchMessagesRequest(selectedConversationId));
    setShowList(false);

    const socket = socketRef.current;

    if (socket?.connected) {
      socket.emit("joinconversation", selectedConversationId);
    }
  }, [selectedConversationId, dispatch]);

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessageSent = (data: any) => {
      if (data.success && data.tempId && selectedConversationId) {
        dispatch(
          chatActions.updateMessageStatus({
            conversationId: selectedConversationId,
            messageId: data.tempId,
            status: data.status || "SENT",
            realId: data.messageId,
          })
        );
      }
    };

    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("messageSent", handleMessageSent);
    };
  }, [selectedConversationId, dispatch]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversationId]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = async (text: string) => {
    if (!text.trim() || !selectedConversationId) return;

    const socket = socketRef.current;

    if (!socket?.connected) {
      console.error("❌ Socket not connected");
      return;
    }

    const tempId = `temp_${Date.now()}`;

    dispatch(
      chatActions.optimisticMessageAdded({
        _id: tempId,
        conversationId: selectedConversationId,
        senderId: myId,
        text,
        status: "SENDING",
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
      })
    );

    socket.emit("sendMessage", {
      conversationId: selectedConversationId,
      text,
      tempId,
      ...(replyTo ? { replyToMessageId: replyTo._id } : {}),
    });

    setReplyTo(null);
  };

  /* ---------------- DATA ---------------- */

  const currentMessages = selectedConversationId
    ? messages[selectedConversationId] || []
    : [];

  const selectedConv = conversations.find(
    (c) => c._id === selectedConversationId
  );

  const otherParticipant = selectedConv
    ? getOtherParticipant(selectedConv, myId)
    : null;

  const filteredConvs = conversations.filter((c) => {
    if (!search) return true;

    const other = getOtherParticipant(c, myId);

    return (
      other.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessageText?.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* ---------------- UI ---------------- */

  return (
    <DashboardShell>
      <div className="h-[calc(100vh-2rem)] flex overflow-hidden p-4 gap-4">
        <div className={cn(!showList && "hidden lg:flex")}>
          <ConversationList
            conversations={filteredConvs}
            selectedId={selectedConversationId}
            myId={myId}
            loading={conversationsLoading}
            search={search}
            onSearchChange={setSearch}
            onSelect={(id) => dispatch(chatActions.selectConversation(id))}
          />
        </div>

        <div className="flex-1 flex flex-col bg-card border rounded-2xl overflow-hidden">
          {!selectedConversationId ? (
            <div className="flex-1 flex items-center justify-center">
              <MessageCircle />
            </div>
          ) : (
            <>
              <ChatHeader
                participantName={otherParticipant?.name || ""}
                participantInitial={otherParticipant?.initial || "?"}
                contextType={selectedConv?.contextType || "DEAL"}
                contextId={selectedConv?.contextId?.toString() || ""}
              />

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {messagesLoading ? (
                  <Skeleton className="h-12 w-48" />
                ) : (
                  <AnimatePresence>
                    {currentMessages.map((msg, idx) => {
                      const senderId =
                        typeof msg.senderId === "object"
                          ? (msg.senderId as any)._id
                          : msg.senderId;

                      const isMe = senderId === myId;

                      return (
                        <div key={msg._id}>
                          {shouldShowDateSep(currentMessages, idx) && (
                            <ChatDateSeparator
                              date={msg.sentAt || msg.createdAt}
                            />
                          )}

                          <ChatMessageBubble
                            msg={msg}
                            isMe={isMe}
                            isGroupStart={isGroupStart(
                              currentMessages,
                              idx
                            )}
                            participantInitial={
                              otherParticipant?.initial || "?"
                            }
                            onReply={setReplyTo}
                          />
                        </div>
                      );
                    })}
                  </AnimatePresence>
                )}

                <div ref={bottomRef} />
              </div>

              <ChatInputBar
                onSend={handleSend}
                replyTo={replyTo}
                onClearReply={() => setReplyTo(null)}
              />
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default MessagesPage;