import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string | { _id: string; name?: string; email?: string };
  text: string;
  attachments?: any[];
  status: "SENDING" | "SENT" | "DELIVERED" | "READ";
  sentAt: string;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participantIds: Array<{ _id: string; name?: string; email?: string } | string>;
  contextType: "REQUIREMENT" | "DEAL";
  contextId: string;
  lastMessageText?: string;
  lastMessageAt?: string;
  userSettings: Array<{
    userId: string;
    unreadCount: number;
    isMuted: boolean;
    isPinned: boolean;
    isArchived: boolean;
    lastReadAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: Record<string, ChatMessage[]>; // keyed by conversationId
  conversationsLoading: boolean;
  messagesLoading: boolean;
  error: string | null;
  totalUnread: number;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversationId: null,
  messages: {},
  conversationsLoading: false,
  messagesLoading: false,
  error: null,
  totalUnread: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    /* ── Fetch conversations ── */
    fetchConversationsRequest(state) {
      state.conversationsLoading = true;
      state.error = null;
    },
    fetchConversationsSuccess(state, action: PayloadAction<Conversation[]>) {
      state.conversationsLoading = false;
      state.conversations = action.payload;
      state.totalUnread = action.payload.reduce((sum, c) => {
        const me = c.userSettings?.find(
          (s: any) => s.userId?.toString() === (state as any).myUserId
        );
        return sum + (me?.unreadCount || 0);
      }, 0);
    },
    fetchConversationsFailure(state, action: PayloadAction<string>) {
      state.conversationsLoading = false;
      state.error = action.payload;
    },

    /* ── Fetch messages ── */
    fetchMessagesRequest(state, _action: PayloadAction<string>) {
      state.messagesLoading = true;
    },
    fetchMessagesSuccess(
      state,
      action: PayloadAction<{ conversationId: string; messages: ChatMessage[] }>
    ) {
      state.messagesLoading = false;
      // Reverse so newest messages appearing first from API are rendered at the bottom
      state.messages[action.payload.conversationId] = [...action.payload.messages].reverse();
    },
    fetchMessagesFailure(state, action: PayloadAction<string>) {
      state.messagesLoading = false;
      state.error = action.payload;
    },

    /* ── Initiate conversation ── */
    initiateConversationRequest(
      state,
      _action: PayloadAction<{
        participantId: string;
        contextType: "REQUIREMENT" | "DEAL";
        contextId: string;
        onSuccess?: (conversationId: string) => void;
        onError?: (msg: string) => void;
      }>
    ) {
      state.conversationsLoading = true;
    },
    initiateConversationSuccess(state, action: PayloadAction<Conversation>) {
      state.conversationsLoading = false;
      const exists = state.conversations.find((c) => c._id === action.payload._id);
      if (!exists) state.conversations.unshift(action.payload);
      state.selectedConversationId = action.payload._id;
    },
    initiateConversationFailure(state, action: PayloadAction<string>) {
      state.conversationsLoading = false;
      state.error = action.payload;
    },

    /* ── Select conversation ── */
    selectConversation(state, action: PayloadAction<string>) {
      state.selectedConversationId = action.payload;
    },

    /* ── New message (from socket) ── */
    receiveMessage(state, action: PayloadAction<ChatMessage>) {
      const msg = action.payload;
      const cid = msg.conversationId;
      if (!state.messages[cid]) state.messages[cid] = [];
      // avoid duplicates
      const exists = state.messages[cid].find((m) => m._id === msg._id);
      if (!exists) state.messages[cid].push(msg);

      // update last message on conversation
      const conv = state.conversations.find((c) => c._id === cid);
      if (conv) {
        conv.lastMessageText = msg.text;
        conv.lastMessageAt = msg.sentAt;
      }
    },

    /* ── Mark as read (optimistic) ── */
    markConversationRead(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
      const conv = state.conversations.find((c) => c._id === action.payload.conversationId);
      if (conv) {
        const setting = conv.userSettings?.find(
          (s: any) => s.userId?.toString() === action.payload.userId
        );
        if (setting) setting.unreadCount = 0;
      }
      // recalculate total
      state.totalUnread = state.conversations.reduce((sum, c) => {
        const me = c.userSettings?.find(
          (s: any) => s.userId?.toString() === action.payload.userId
        );
        return sum + (me?.unreadCount || 0);
      }, 0);
    },

    /* ── Unread count from socket ── */
    incrementUnread(state, action: PayloadAction<{ conversationId: string; myId: string }>) {
      const conv = state.conversations.find((c) => c._id === action.payload.conversationId);
      if (conv) {
        const setting = conv.userSettings?.find(
          (s: any) => s.userId?.toString() === action.payload.myId
        );
        if (setting) {
          setting.unreadCount += 1;
        }

        // recalculate total accurately
        state.totalUnread = state.conversations.reduce((sum, currentConv) => {
          const mySettings = currentConv.userSettings?.find(
            (s: any) => s.userId?.toString() === action.payload.myId
          );
          return sum + (mySettings?.unreadCount || 0);
        }, 0);
      }
    },

    /* ── Optimistic UI Updates ── */
    optimisticMessageAdded(state, action: PayloadAction<ChatMessage>) {
      const msg = action.payload;
      const cid = msg.conversationId;
      if (!state.messages[cid]) state.messages[cid] = [];
      state.messages[cid].push(msg);

      const conv = state.conversations.find((c) => c._id === cid);
      if (conv) {
        conv.lastMessageText = msg.text;
        conv.lastMessageAt = msg.sentAt || new Date().toISOString();
      }
    },

    updateMessageStatus(state, action: PayloadAction<{ conversationId: string; messageId: string; status: ChatMessage["status"]; realId?: string }>) {
      const { conversationId, messageId, status, realId } = action.payload;
      const msgs = state.messages[conversationId];
      if (msgs) {
        const idx = msgs.findIndex((m) => m._id === messageId);
        if (idx !== -1) {
          msgs[idx].status = status;
          if (realId) msgs[idx]._id = realId;
        }
      }
    },

    clearChat(state) {
      Object.assign(state, initialState);
    },
  },
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;