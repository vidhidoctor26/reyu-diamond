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
import { getSocket } from "@/lib/socket";

import ConversationList from "./components/ConversationList";
import ChatHeader from "./components/ChatHeader";
import ChatMessageBubble from "./components/ChatMessageBubble";
import ChatDateSeparator from "./components/ChatDateSeparator";
import ChatInputBar from "./components/ChatInputBar";

const getOtherParticipant = (conv: any, myId: string) => {
  const other = conv.participantIds?.find((p: any) => {
    const id = typeof p === "string" ? p : p._id;
    return id !== myId;
  });
  if (!other) return { name: "Unknown", initial: "?" };
  const name = typeof other === "string" ? "User" : other.name || other.email || "User";
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
  const prevId = typeof msgs[idx - 1].senderId === "object" ? (msgs[idx - 1].senderId as any)._id : msgs[idx - 1].senderId;
  const currId = typeof msgs[idx].senderId === "object" ? (msgs[idx].senderId as any)._id : msgs[idx].senderId;
  return prevId !== currId || shouldShowDateSep(msgs, idx);
};

const MessagesPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { conversations, selectedConversationId, messages, conversationsLoading, messagesLoading } =
    useAppSelector((s) => s.chat);
  const { user } = useAppSelector((s) => s.auth);
  const myId = user?._id || "";

  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 1. Fetch conversations on mount
  useEffect(() => {
    dispatch(chatActions.fetchConversationsRequest());
  }, [dispatch]);

  // 2. Auto-select from ?id= query param (when navigating from DealsPage)
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) dispatch(chatActions.selectConversation(id));
  }, [searchParams, dispatch]);

  // 3. When conversation selected: fetch messages, join socket room, mark as read
  useEffect(() => {
    if (!selectedConversationId) return;

    dispatch(chatActions.fetchMessagesRequest(selectedConversationId));
    setShowList(false);

    const socket = getSocket();
    if (socket?.connected) {
      // Join the conversation room to receive newMessage events
      socket.emit("joinConversation", selectedConversationId);
      // Mark all existing messages as read
      socket.emit("markAsRead", { conversationId: selectedConversationId });
    }

    // Optimistically reset unread badge in Redux
    dispatch(chatActions.markConversationRead({ conversationId: selectedConversationId, userId: myId }));
  }, [selectedConversationId, dispatch, myId]);

  // 4. Socket event listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // New message received from the other person (or echoed back after send)
    const handleNewMessage = (msg: ChatMessage) => {
      dispatch(chatActions.receiveMessage(msg));
      // If this conversation is open, immediately mark as read
      if (msg.conversationId === selectedConversationId) {
        socket.emit("markAsRead", { conversationId: msg.conversationId });
      }
    };

    // Other person opened conversation and read our messages → refresh to show READ ticks
    const handleMessagesRead = ({ conversationId, readBy }: { conversationId: string; readBy: string }) => {
      if (conversationId === selectedConversationId) {
        dispatch(chatActions.fetchMessagesRequest(conversationId));
      }
      dispatch(chatActions.markConversationRead({ conversationId, userId: readBy }));
    };

    // Other person came online → our SENT messages became DELIVERED → refresh ticks
    const handleMessagesDelivered = ({ conversationId }: { conversationId: string }) => {
      if (conversationId === selectedConversationId) {
        dispatch(chatActions.fetchMessagesRequest(conversationId));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("messagesDelivered", handleMessagesDelivered);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("messagesDelivered", handleMessagesDelivered);
    };
  }, [selectedConversationId, dispatch]);

  // 5. Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversationId]);

  const handleSelect = (id: string) => dispatch(chatActions.selectConversation(id));

  // 6. Send via socket
  const handleSend = (text: string) => {
    if (!text.trim() || !selectedConversationId) return;

    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("sendMessage", {
        conversationId: selectedConversationId,
        text,
        ...(replyTo ? { replyToMessageId: replyTo._id } : {}),
      });
    } else {
      console.error("Socket not connected — message not sent");
    }

    setReplyTo(null);
  };

  const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];
  const selectedConv = conversations.find((c) => c._id === selectedConversationId);
  const otherParticipant = selectedConv ? getOtherParticipant(selectedConv, myId) : null;

  const filteredConvs = conversations.filter((c) => {
    if (!search) return true;
    const other = getOtherParticipant(c, myId);
    return (
      other.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessageText?.toLowerCase().includes(search.toLowerCase())
    );
  });

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
            onSelect={handleSelect}
          />
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden",
            showList && !selectedConversationId && "hidden lg:flex"
          )}
        >
          {!selectedConversationId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          ) : (
            <>
              <ChatHeader
                participantName={otherParticipant?.name || ""}
                participantInitial={otherParticipant?.initial || "?"}
                contextType={selectedConv?.contextType || "DEAL"}
                contextId={selectedConv?.contextId?.toString() || ""}
              />
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1 bg-muted/30">
                {messagesLoading ? (
                  <div className="space-y-4 py-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={cn("flex gap-2", i % 2 === 0 ? "justify-end" : "")}>
                        <Skeleton className="h-12 w-48 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : currentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {currentMessages.map((msg, idx) => {
                      const senderId =
                        typeof msg.senderId === "object"
                          ? (msg.senderId as any)._id
                          : msg.senderId;
                      const isMe = senderId === myId;
                      return (
                        <div key={msg._id}>
                          {shouldShowDateSep(currentMessages, idx) && (
                            <ChatDateSeparator date={msg.sentAt || msg.createdAt} />
                          )}
                          <ChatMessageBubble
                            msg={msg}
                            isMe={isMe}
                            isGroupStart={isGroupStart(currentMessages, idx)}
                            participantInitial={otherParticipant?.initial || "?"}
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