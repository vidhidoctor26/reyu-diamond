import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Gavel, ArrowUpRight, TrendingUp, TrendingDown,
  Clock, CheckCircle2, XCircle, Timer,
} from "lucide-react";

const fmtMoney = (n: number) => {
  if (!n) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

type Tab = "placed" | "received";

const statusMap: Record<string, { label: string; cls: string; bg: string; Icon: any }> = {
  ACTIVE:   { label: "Active",    cls: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",     Icon: Clock       },
  ACCEPTED: { label: "Accepted",  cls: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800", Icon: CheckCircle2 },
  REJECTED: { label: "Rejected",  cls: "text-rose-600",    bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800",       Icon: XCircle     },
  EXPIRED:  { label: "Expired",   cls: "text-slate-500",   bg: "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700",   Icon: Timer       },
};

const ActiveBids = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("placed");

  const { myBids, auctionBids, loading } = useAppSelector((s) => s.bid);

  const placedBids   = [...myBids].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const receivedBids = [...auctionBids].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const currentList  = tab === "placed" ? placedBids : receivedBids;

  // Summary counts
  const placedAccepted  = myBids.filter((b) => b.status === "ACCEPTED").length;
  const placedActive    = myBids.filter((b) => b.status === "ACTIVE").length;
  const receivedPending = auctionBids.filter((b) => b.status === "ACTIVE").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.24 }}
    >
      <Card className="card-premium">
        {/* Header */}
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Gavel className="h-4 w-4 text-muted-foreground" />
            Bids
          </CardTitle>
          <button
            onClick={() => navigate("/user/bids")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </CardHeader>

        {/* Tabs + summary chips */}
        <div className="px-6 pt-3 pb-3 flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(["placed", "received"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs px-3 py-1.5 rounded-md transition-all font-medium ${
                  tab === t
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {t === "placed" ? "Placed" : "Received"}
                <span className={`ml-1.5 text-[10px] tabular-nums ${tab === t ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                  ({t === "placed" ? myBids.length : auctionBids.length})
                </span>
              </button>
            ))}
          </div>

          {/* Quick stat chip */}
          {tab === "placed" && placedActive > 0 && (
            <span className="text-[11px] text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-medium">
              {placedActive} active
            </span>
          )}
          {tab === "received" && receivedPending > 0 && (
            <span className="text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-medium animate-pulse">
              {receivedPending} awaiting review
            </span>
          )}
        </div>

        <Separator />

        <CardContent className="pt-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : currentList.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                <Gavel className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-primary">
                No {tab === "placed" ? "bids placed" : "bids received"} yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {tab === "placed"
                  ? "Browse auctions to start bidding"
                  : "List diamonds to receive bids"}
              </p>
              {tab === "placed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 text-xs gap-1.5"
                  onClick={() => navigate("/user/marketplace")}
                >
                  Browse Auctions
                </Button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === "placed" ? -8 : 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-1.5"
              >
                {currentList.map((bid, idx) => {
                  const s = statusMap[bid.status] ?? statusMap.ACTIVE;
                  const { Icon } = s;
                  const isHighest = bid.isHighestBid;

                  // Derive a human auction label from the ID
                  const shortId = bid.auctionId?.toString().slice(-5).toUpperCase() ?? "—";

                  return (
                    <motion.div
                      key={bid._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-default"
                    >
                      {/* Status icon */}
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${s.bg}`}
                      >
                        <Icon className={`h-4 w-4 ${s.cls}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-primary truncate">
                            Auction #{shortId}
                          </p>
                          {isHighest && (
                            <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                              <TrendingUp className="h-3 w-3" />
                              Highest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {fmtDate(bid.createdAt)}
                        </p>
                      </div>

                      {/* Amount + badge */}
                      <div className="text-right shrink-0 space-y-1">
                        <p className="text-sm font-bold text-primary tabular-nums">
                          {fmtMoney(bid.bidAmount)}
                        </p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${s.bg} ${s.cls}`}>
                          {s.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {/* CTA for received bids */}
          {tab === "received" && receivedPending > 0 && (
            <Button
              size="sm"
              className="w-full mt-3 text-xs gap-1.5 btn-premium"
              onClick={() => navigate("/user/bids")}
            >
              Review {receivedPending} pending bid{receivedPending > 1 ? "s" : ""}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActiveBids;