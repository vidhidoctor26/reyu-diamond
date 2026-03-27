import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

const NotificationHeader = ({ unreadCount, onMarkAllRead }: NotificationHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-accent/20">
        <Bell className="h-5 w-5 text-accent" />
      </div>
      <h1 className="font-display text-2xl font-semibold text-foreground">Notifications</h1>
      {unreadCount > 0 && (
        <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5">
          {unreadCount}
        </Badge>
      )}
    </div>
    {unreadCount > 0 && (
      <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="text-muted-foreground gap-1.5">
        <CheckCheck className="h-4 w-4" />
        Mark all as read
      </Button>
    )}
  </div>
);

export default NotificationHeader;
