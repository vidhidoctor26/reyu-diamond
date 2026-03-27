import type { Notification } from "../useNotifications";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  grouped: { label: string; items: Notification[] }[];
  onRead: (id: string) => void;
}

const NotificationList = ({ grouped, onRead }: NotificationListProps) => (
  <div className="space-y-6">
    {grouped.map((group) => (
      <div key={group.label}>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-4 mb-2">
          {group.label}
        </p>
        <div className="space-y-1">
          {group.items.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={onRead} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default NotificationList;
