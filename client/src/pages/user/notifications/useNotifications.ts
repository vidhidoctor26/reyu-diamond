import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchNotificationsRequest,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  type INotification,
} from "@/store/slices/notificationsSlice";

// ✅ Export types from here for components
export type Notification = INotification;
export type NotificationType = INotification["type"];

export function useNotifications() {
    const dispatch = useAppDispatch();
    
    const { notifications, unreadCount, loading } = useAppSelector(
        (state: any) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotificationsRequest());
    dispatch(fetchUnreadCount());           // ✅ typed action
  }, [dispatch]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));               // ✅ typed action
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());              // ✅ typed action
  };

  const grouped = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);

    const todayItems: Notification[] = [];
    const yesterdayItems: Notification[] = [];
    const olderItems: Notification[] = [];

    notifications.forEach((n: Notification) => {
      const d = new Date(n.createdAt);
      if (d >= today) todayItems.push(n);
      else if (d >= yesterday) yesterdayItems.push(n);
      else olderItems.push(n);
    });

    const groups = [];
    if (todayItems.length) groups.push({ label: "Today", items: todayItems });
    if (yesterdayItems.length) groups.push({ label: "Yesterday", items: yesterdayItems });
    if (olderItems.length) groups.push({ label: "Earlier", items: olderItems });

    return groups;
  }, [notifications]);

  return {
    grouped,
    unreadCount,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
}