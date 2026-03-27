import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface INotification {
  id: string;
  type: "BID" | "AUCTION" | "DEAL" | "PAYMENT" | "CHAT" | "KYC" | "ADMIN" | "ADS" | "RATING" | "SYSTEM";
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  link: string;
}

export interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    fetchNotificationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<INotification[]>) => {
      state.loading = false;
      state.notifications = action.payload;
    },
    fetchNotificationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchUnreadCount: () => {},
    fetchUnreadCountSuccess: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    markAsRead: (_state, _action: PayloadAction<string>) => {},
    markAsReadSuccess: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n && !n.read) {
        n.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: () => {},
    markAllAsReadSuccess: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
  },
});

export const notificationActions = notificationSlice.actions;

export const {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchUnreadCount,
  fetchUnreadCountSuccess,
  markAsRead,
  markAsReadSuccess,
  markAllAsRead,
  markAllAsReadSuccess,
} = notificationSlice.actions;

export default notificationSlice.reducer;