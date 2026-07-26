import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Handshake, ArrowUpRight, Diamond,
  AlertTriangle, CheckCircle2, Clock,
  Truck, CreditCard,
} from "lucide-react";
import type { DealStatus } from "@/store/slices/dealSlice";

const fmtVolume = (n: number) => {
  if (!n) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
};

const statusConfig: Record<
  DealStatus,
  { label: string; cls: string; Icon: any }
> = {
  CREATED:         { label: "Created",         cls: "border-slate-400 text-slate-500",   Icon: Clock },
  PAYMENT_PENDING: { label: "Payment Pending", cls: "border-amber-400 text-amber-600",   Icon: CreditCard },
  PAYMENT_FAILED:  { label: "Payment Failed",  cls: "border-rose-400 text-rose-600",     Icon: AlertTriangle },
  IN_ESCROW:       { label: "In Escrow",       cls: "border-blue-400 text-blue-600",     Icon: Clock },
  SHIPPED:         { label: "Shipped",         cls: "border-cyan-400 text-cyan-600",     Icon: Truck },
  DELIVERED:       { label: "Delivered",       cls: "border-emerald-300 text-emerald-500", Icon: CheckCircle2 },
  COMPLETED:       { label: "Completed",       cls: "border-emerald-400 text-emerald-600", Icon: CheckCircle2 },
  DISPUTED:        { label: "Disputed",        cls: "border-rose-400 text-rose-600",     Icon: AlertTriangle },
  CANCELLED:       { label: "Cancelled",       cls: "border-slate-400 text-slate-400",   Icon: Clock },
};

const DealsTimeline = () => {
  const navigate = useNavigate();
  const { deals, loading } = useAppSelector((s) => s.deal);
  const { user } = useAppSelector((s) => s.auth);

  const recent = [...deals]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="card-premium">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Handshake className="h-4 w-4 text-muted-foreground" />
            Recent Deals
          </CardTitle>
          <button
            onClick={() => navigate("/user/deals")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </CardHeader>

        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-8">
              <Handshake className="h-7 w-7 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No deals yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((deal) => {
                const cfg =
                  statusConfig[deal.status] ?? statusConfig.CREATED;
                const { Icon } = cfg;
                const isBuyer = deal.buyerId?._id === user?._id;
                const counterpart = isBuyer
                  ? deal.sellerId?.name
                  : deal.buyerId?.name;

                return (
                  <motion.div
                    key={deal._id}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() => navigate(`/user/deals/${deal._id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        deal.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-900/20"
                          : deal.status === "DISPUTED"
                          ? "bg-rose-100 dark:bg-rose-900/20"
                          : "bg-muted"
                      }`}
                    >
                      <Diamond className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        {isBuyer ? "Bought from" : "Sold to"}{" "}
                        <span className="font-semibold">{counterpart}</span>
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(deal.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-primary">
                        {fmtVolume(deal.dealAmount)}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${cfg.cls}`}
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Disputed deals alert */}
          {deals.some((d) => d.status === "DISPUTED") && (
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-3 text-xs gap-1.5 border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10"
              onClick={() => navigate("/user/deals")}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              You have disputed deals — review now
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DealsTimeline;