import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Loader2,
  TrendingUp, Wallet, ShieldCheck,
  Diamond
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { dealActions } from "@/store/slices/dealSlice";
import { dealStatusConfig } from "../deal/components/DealStatusBadge";

/* ─── Types & Constants ───────────────────────────────────── */
type TxType = "incoming" | "outgoing" | "pending" | "failed";

const fmt = (amount: number) =>
  new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  }).format(amount);

const PaymentsPage = () => {
  const dispatch = useAppDispatch();
  const { deals, loading } = useAppSelector((s) => s.deal);
  const { user } = useAppSelector((s) => s.auth);
  const [filter, setFilter] = useState<"all" | TxType>("all");

  useEffect(() => {
    dispatch(dealActions.fetchDealsRequest());
  }, [dispatch]);

  const transactions = useMemo(() => {
    if (!user) return [];
    return [...deals]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((d) => {
        const isBuyer = ((d.buyerId as any)?._id || d.buyerId) === user._id;
        const inv = d.inventoryId as any;
        
        let type: TxType = "pending";
        if (["PAYMENT_FAILED", "CANCELLED"].includes(d.status)) type = "failed";
        else if (d.status === "COMPLETED") type = isBuyer ? "outgoing" : "incoming";
        else if (["IN_ESCROW", "SHIPPED", "DELIVERED"].includes(d.status)) type = "pending";

        return {
          id: d._id,
          type,
          amount: d.dealAmount,
          counterparty: isBuyer ? (d.sellerId as any)?.name : (d.buyerId as any)?.name,
          diamondName: inv ? `${inv.shape} ${inv.carat}ct` : "Diamond",
          specs: inv ? `${inv.color}/${inv.clarity}/${inv.cut}` : "-",
          thumbnail: inv?.images?.[0] || null,
          status: d.status,
          date: d.createdAt,
        };
      });
  }, [deals, user]);

  const stats = useMemo(() => ({
    received: transactions.filter(t => t.type === "incoming").reduce((s, t) => s + t.amount, 0),
    paid:     transactions.filter(t => t.type === "outgoing").reduce((s, t) => s + t.amount, 0),
    escrow:   transactions.filter(t => t.type === "pending").reduce((s, t) => s + t.amount, 0),
    count:    transactions.length
  }), [transactions]);

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

  return (
    <DashboardShell>
      {/* ✅ Padding and Space-y synced with MyBids.tsx */}
      <div className="p-3 lg:p-2 space-y-8">
        
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary">Payments</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your financial history and escrowed funds.
          </p>
        </motion.div>

        {/* ── Stats Grid (Styled like BidStats) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Received", val: fmt(stats.received), icon: TrendingUp, color: "text-emerald-500" },
            { label: "Total Paid", val: fmt(stats.paid), icon: CreditCard, color: "text-blue-500" },
            { label: "In Escrow", val: fmt(stats.escrow), icon: ShieldCheck, color: "text-amber-500" },
            { label: "Total Vol.", val: stats.count, icon: Wallet, color: "text-primary" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-premium border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 flex flex-col gap-1">
                  <s.icon className={`h-5 w-5 ${s.color} mb-1`} />
                  <p className="text-xl md:text-2xl font-display font-bold tracking-tight">{s.val}</p>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Filter Controls (Styled like BidFilters) ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {(["all", "incoming", "outgoing", "pending", "failed"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                  filter === key 
                    ? "bg-primary text-primary-foreground border-primary shadow-md" 
                    : "bg-background text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Transaction List (Styled like BidList) ── */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No transactions found</p>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((tx) => {
                  return (
                    <motion.div
                      key={tx.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-accent/30 transition-all shadow-sm"
                    >
                      {/* Thumbnail matching BidCard style */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/50">
                        {tx.thumbnail ? (
                          <img src={tx.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Diamond className="h-5 w-5 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm md:text-base truncate">{tx.diamondName}</p>
                          <Badge variant="secondary" className="text-[10px] h-4 px-1.5 opacity-70">
                            {tx.specs}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {tx.type === "incoming" ? "From" : "To"} <span className="font-medium text-foreground/70">{tx.counterparty || "Verified User"}</span>
                          <span className="mx-1.5">•</span>
                          {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`font-display font-bold text-sm md:text-lg ${
                          tx.type === "incoming" ? "text-emerald-600" :
                          tx.type === "failed"   ? "text-rose-400 line-through" :
                          tx.type === "pending"  ? "text-amber-600" : "text-foreground"
                        }`}>
                          {tx.type === "incoming" ? "+" : tx.type === "outgoing" ? "-" : ""}{fmt(tx.amount)}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`${dealStatusConfig[tx.status]?.className} text-[10px] py-0 px-2 h-5 border-none bg-opacity-10 capitalize`}
                        >
                          {dealStatusConfig[tx.status]?.label || tx.status}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default PaymentsPage;