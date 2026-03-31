import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { notificationActions } from "@/store/slices/notificationsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Bell, ArrowUpRight, CheckCheck,
  Gavel, Handshake, CreditCard, MessageSquare,
  ShieldCheck, Megaphone, Star, AlertCircle, Zap,
} from "lucide-react";

const typeConfig: Record<string, { Icon: any; bg: string; color: string }> = {
  BID:     { Icon: Gavel,        bg: "bg-blue-50 dark:bg-blue-900/20",    color: "text-blue-600"    },
  AUCTION: { Icon: Gavel,        bg: "bg-blue-50 dark:bg-blue-900/20",    color: "text-blue-600"    },
  DEAL:    { Icon: Handshake,    bg: "bg-emerald-50 dark:bg-emerald-900/20", color: "text-emerald-600" },
  PAYMENT: { Icon: CreditCard,   bg: "bg-violet-50 dark:bg-violet-900/20", color: "text-violet-600"  },
  CHAT:    { Icon: MessageSquare,bg: "bg-sky-50 dark:bg-sky-900/20",      color: "text-sky-600"     },
  KYC:     { Icon: ShieldCheck,  bg: "bg-amber-50 dark:bg-amber-900/20",  color: "text-amber-600"   },
  ADS:     { Icon: Megaphone,    bg: "bg-pink-50 dark:bg-pink-900/20",    color: "text-pink-600"    },
  RATING:  { Icon: Star,         bg: "bg-yellow-50 dark:bg-yellow-900/20",color: "text-yellow-600"  },
  ADMIN:   { Icon: AlertCircle,  bg: "bg-rose-50 dark:bg-rose-900/20",    color: "text-rose-600"    },
  SYSTEM:  { Icon: Zap,          bg: "bg-slate-50 dark:bg-slate-800/40",  color: "text-slate-500"   },
};

const timeAgo = (date: Date | string) => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationsPanel = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector((s) => s.notifications);

  const recent = notifications.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="card-premium">
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            Notifications
            {unreadCount > 0 && (
              <span className="h-5 min-w-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(notificationActions.markAllAsRead())}
                title="Mark all as read"
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">All read</span>
              </button>
            )}
            <button
              onClick={() => navigate("/user/notifications")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        <Separator className="mt-3" />

        <CardContent className="pt-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                <Bell className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-primary">All caught up!</p>
              <p className="text-xs text-muted-foreground mt-0.5">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {recent.map((n, idx) => {
                const cfg = typeConfig[n.type] ?? typeConfig.SYSTEM;
                const { Icon } = cfg;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => {
                      if (!n.read) dispatch(notificationActions.markAsRead(n.id));
                      if (n.link) navigate(n.link);
                    }}
                    className={`relative flex gap-3 p-2.5 rounded-xl transition-colors cursor-pointer group ${
                      !n.read
                        ? "bg-accent/5 hover:bg-accent/10"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <div className="absolute right-2.5 top-2.5 w-1.5 h-1.5 rounded-full bg-accent" />
                    )}

                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-3">
                      <p className={`text-xs leading-snug truncate ${!n.read ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5 line-clamp-1">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {notifications.length > 6 && (
            <Button
              size="sm"
              variant="ghost"
              className="w-full mt-2 text-xs h-8 text-muted-foreground"
              onClick={() => navigate("/user/notifications")}
            >
              View all {notifications.length} notifications
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPanel;