import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gavel, Handshake, MessageCircle, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "../useNotifications";

const typeConfig: Record<NotificationType, { icon: React.ElementType; colorClass: string }> = {
  BID: { icon: Gavel, colorClass: "bg-accent/15 text-accent" },
  DEAL: { icon: Handshake, colorClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  CHAT: { icon: MessageCircle, colorClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  PAYMENT: { icon: CreditCard, colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  SYSTEM: { icon: Settings, colorClass: "bg-muted text-muted-foreground" },
};

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  const navigate = useNavigate();
  const { icon: Icon, colorClass } = typeConfig[notification.type];

  const handleClick = () => {
    onRead(notification.id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 p-4 rounded-xl text-left transition-colors duration-200",
        notification.read
          ? "hover:bg-muted/60"
          : "bg-accent/5 hover:bg-accent/10"
      )}
    >
      {/* Icon */}
      <div className={cn("shrink-0 p-2 rounded-lg", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className={cn("text-sm leading-snug", !notification.read && "font-semibold text-foreground")}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">{notification.body}</p>
        <p className="text-[11px] text-muted-foreground/70">{relativeTime(notification.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <span className="shrink-0 mt-2 w-2 h-2 rounded-full bg-accent" />
      )}
    </motion.button>
  );
};

export default NotificationItem;
