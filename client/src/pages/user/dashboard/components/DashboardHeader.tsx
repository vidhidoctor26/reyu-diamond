import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Bell, ShieldAlert, Gavel, MessageSquare,
} from "lucide-react";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { unreadCount } = useAppSelector((s) => s.notifications);

  // Pending bids received (seller perspective)
  const bidsReceived = useAppSelector((s) => s.bid.auctionBids);
  const pendingBidsCount = bidsReceived.filter((b) => b.status === "ACTIVE").length;

  // Disputed deals
  const deals = useAppSelector((s) => s.deal.deals);
  const disputedCount = deals.filter((d) => d.status === "DISPUTED").length;

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
    >
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
          {greeting}
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary leading-tight">
          {firstName} ✦
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Alert badges */}
        {unreadCount > 0 && (
          <button onClick={() => navigate("/user/notifications")}>
            <Badge className="gap-1.5 bg-blue-500/10 text-blue-600 border-blue-400 hover:bg-blue-500/20 cursor-pointer transition-colors">
              <Bell className="h-3 w-3" />
              {unreadCount} unread
            </Badge>
          </button>
        )}
        {pendingBidsCount > 0 && (
          <button onClick={() => navigate("/user/bids")}>
            <Badge className="gap-1.5 bg-amber-500/10 text-amber-600 border-amber-400 hover:bg-amber-500/20 cursor-pointer transition-colors">
              <Gavel className="h-3 w-3" />
              {pendingBidsCount} bid{pendingBidsCount > 1 ? "s" : ""} to review
            </Badge>
          </button>
        )}
        {disputedCount > 0 && (
          <button onClick={() => navigate("/user/deals")}>
            <Badge className="gap-1.5 bg-rose-500/10 text-rose-600 border-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors">
              <ShieldAlert className="h-3 w-3" />
              {disputedCount} dispute{disputedCount > 1 ? "s" : ""}
            </Badge>
          </button>
        )}

        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => navigate("/user/messages")}
        >
          <MessageSquare className="h-4 w-4" />
          Messages
        </Button>

        <Button
          size="sm"
          className="btn-premium gap-1.5"
          onClick={() => navigate("/user/inventory/add")}
        >
          <Plus className="h-4 w-4" />
          Add Diamond
        </Button>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;