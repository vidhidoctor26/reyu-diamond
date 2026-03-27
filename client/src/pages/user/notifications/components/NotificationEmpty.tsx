import { BellOff } from "lucide-react";

const NotificationEmpty = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="p-4 rounded-2xl bg-muted mb-4">
      <BellOff className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-1">No notifications yet</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      When you receive bids, deal updates, or messages, they'll appear here.
    </p>
  </div>
);

export default NotificationEmpty;
