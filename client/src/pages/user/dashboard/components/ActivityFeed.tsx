import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity, Gavel, Handshake, Diamond, Bell,
} from "lucide-react";

interface FeedItem {
  id: string;
  icon: any;
  iconColor: string;
  text: string;
  timestamp: Date;
}

const timeAgo = (date: Date) => {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ActivityFeed = () => {
  const { user } = useAppSelector((s) => s.auth);
  const deals = useAppSelector((s) => s.deal.deals);
  const bids = useAppSelector((s) => s.bid.myBids);
  const notifications = useAppSelector((s) => s.notifications.notifications);
  const items = useAppSelector((s) => s.inventory.items);

  const feed: FeedItem[] = useMemo(() => {
    const entries: FeedItem[] = [];

    // From deals
    deals.slice(0, 3).forEach((d) => {
      const isBuyer = d.buyerId?._id === user?._id;
      entries.push({
        id: `deal-${d._id}`,
        icon: Handshake,
        iconColor: "text-emerald-500",
        text: isBuyer
          ? `Deal with ${d.sellerId?.name} · ${d.status.replace("_", " ")}`
          : `Deal from ${d.buyerId?.name} · ${d.status.replace("_", " ")}`,
        timestamp: new Date(d.updatedAt),
      });
    });

    // From bids
    bids.slice(0, 3).forEach((b) => {
      entries.push({
        id: `bid-${b._id}`,
        icon: Gavel,
        iconColor: "text-blue-500",
        text: `Bid of $${b.bidAmount.toLocaleString()} · ${b.status}`,
        timestamp: new Date(b.createdAt),
      });
    });

    // From inventory (recently added)
    items.slice(0, 2).forEach((i) => {
      entries.push({
        id: `inv-${i._id}`,
        icon: Diamond,
        iconColor: "text-accent",
        text: `Added "${i.title}" to inventory`,
        timestamp: new Date(i.createdAt),
      });
    });

    // From recent unread notifications
    notifications
      .filter((n) => !n.read)
      .slice(0, 2)
      .forEach((n) => {
        entries.push({
          id: `notif-${n.id}`,
          icon: Bell,
          iconColor: "text-amber-500",
          text: n.title,
          timestamp: new Date(n.createdAt),
        });
      });

    return entries
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 8);
  }, [deals, bids, items, notifications, user?._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.36 }}
    >
      <Card className="card-premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          {feed.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-7 w-7 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No activity yet</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3.5 top-1 bottom-1 w-px bg-border" />

              <div className="space-y-3 pl-8">
                {feed.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.38 + idx * 0.04 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div
                      className={`absolute -left-[25px] top-0.5 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center`}
                    >
                      <item.icon className={`h-2.5 w-2.5 ${item.iconColor}`} />
                    </div>

                    <p className="text-xs text-primary leading-snug">
                      {item.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {timeAgo(item.timestamp)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityFeed;