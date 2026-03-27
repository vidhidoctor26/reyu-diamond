import DashboardShell from "@/components/layout/DashboardShell";
import NotificationHeader from "./components/NotificationHeader";
import NotificationList from "./components/NotificationList";
import NotificationSkeleton from "./components/NotificationSkeleton";
import NotificationEmpty from "./components/NotificationEmpty";
import { useNotifications } from "./useNotifications";

const NotificationsPage = () => {
  const { grouped, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const isEmpty = grouped.length === 0 && !loading;

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <NotificationHeader unreadCount={unreadCount} onMarkAllRead={markAllAsRead} />

        {loading ? (
          <NotificationSkeleton />
        ) : isEmpty ? (
          <NotificationEmpty />
        ) : (
          <div className="card-premium p-2">
            <NotificationList grouped={grouped} onRead={markAsRead} />
          </div>
        )}
      </div>
    </DashboardShell>
  );
};

export default NotificationsPage;
