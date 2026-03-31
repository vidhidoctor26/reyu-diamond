import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { adminActions } from "@/store/slices/adminSlice";
import { motion } from "framer-motion";
import {
  Handshake, Search, Loader2, AlertTriangle, CheckCircle2,
  DollarSign, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { AdminDeal } from "@/store/slices/adminSlice";

const statusConfig: Record<string, { label: string; color: string }> = {
  CREATED:         { label: "Created",         color: "border-slate-400  text-slate-500  bg-slate-50  dark:bg-slate-800/20"  },
  PAYMENT_PENDING: { label: "Payment Pending", color: "border-amber-400  text-amber-600  bg-amber-50  dark:bg-amber-900/20"  },
  IN_ESCROW:       { label: "In Escrow",       color: "border-blue-400   text-blue-600   bg-blue-50   dark:bg-blue-900/20"   },
  SHIPPED:         { label: "Shipped",         color: "border-cyan-400   text-cyan-600   bg-cyan-50   dark:bg-cyan-900/20"   },
  DELIVERED:       { label: "Delivered",       color: "border-indigo-400 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
  COMPLETED:       { label: "Completed",       color: "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
  DISPUTED:        { label: "Disputed",        color: "border-rose-400   text-rose-600   bg-rose-50   dark:bg-rose-900/20"   },
  CANCELLED:       { label: "Cancelled",       color: "border-slate-400  text-slate-500  bg-slate-100 dark:bg-slate-800/30"  },
};

const AdminDeals = () => {
  const dispatch = useAppDispatch();
  const { deals, dealsLoading, actionLoading } = useAppSelector((s) => s.admin);

  const [search,    setSearch]    = useState("");
  const [tab,       setTab]       = useState<"ALL" | "DISPUTED">("ALL");
  const [selected,  setSelected]  = useState<AdminDeal | null>(null);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    dispatch(adminActions.fetchDealsRequest());
  }, [dispatch]);

  const filtered = deals.filter((d) => {
    const matchSearch =
      d.buyerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.sellerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d._id.includes(search);
    const matchTab = tab === "ALL" || d.status === "DISPUTED";
    return matchSearch && matchTab;
  });

  const disputedCount = deals.filter((d) => d.status === "DISPUTED").length;

  const handleResolve = (resolution: "REFUND_BUYER" | "RELEASE_SELLER") => {
    if (!selected) return;
    console.log("Resolving deal:", selected._id, resolution);
    dispatch(adminActions.resolveDisputeRequest({
      id: selected._id,
      resolution,
      adminNote,
    }));
    setSelected(null);
    setAdminNote("");
  };

  return (
    <div className="p-6 lg:p-8">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Deals</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {disputedCount > 0 && (
            <span className="text-rose-500 font-medium">{disputedCount} dispute{disputedCount > 1 ? "s" : ""} require attention · </span>
          )}
          {deals.length} total deals
        </p>
      </div>

      {/* Filter toggle */}
      <div className="flex gap-2">
        {(["ALL", "DISPUTED"] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
            className={t === "DISPUTED" && disputedCount > 0 ? "border-rose-400 text-rose-600" : ""}
          >
            {t === "DISPUTED" && <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />}
            {t === "ALL" ? "All Deals" : `Disputed (${disputedCount})`}
          </Button>
        ))}
      </div>

      <Card className="card-premium">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by buyer, seller or deal ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {dealsLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => {
                  const sc = statusConfig[d.status] ?? statusConfig.CREATED;
                  return (
                    <TableRow key={d._id} className={d.status === "DISPUTED" ? "bg-rose-500/5" : ""}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {d._id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{d.buyerId?.name}</p>
                          <p className="text-xs text-muted-foreground">{d.buyerId?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{d.sellerId?.name}</p>
                          <p className="text-xs text-muted-foreground">{d.sellerId?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 font-semibold text-sm">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          {d.dealAmount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 ${sc.color}`}>
                          {d.status === "DISPUTED" && <AlertTriangle className="h-3 w-3" />}
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {d.status === "DISPUTED" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-rose-400 text-rose-600 hover:bg-rose-50"
                            onClick={() => setSelected(d)}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Resolve
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      No deals found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Resolve Dispute Modal */}
      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) { setSelected(null); setAdminNote(""); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              Resolve Dispute
            </DialogTitle>
            <DialogDescription>
              Deal #{selected?._id.slice(-8).toUpperCase()} ·{" "}
              {selected?.buyerId?.name} vs {selected?.sellerId?.name}
            </DialogDescription>
          </DialogHeader>

          {selected?.dispute && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 text-sm">
              <p className="font-medium text-rose-700 dark:text-rose-400 mb-1">Dispute Reason</p>
              <p className="text-muted-foreground">{selected.dispute.reason}</p>
            </div>
          )}

          <div className="space-y-2 py-1">
            <Label>Admin Note (optional)</Label>
            <Textarea
              placeholder="Internal note about this resolution…"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => { setSelected(null); setAdminNote(""); }}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-emerald-400 text-emerald-600 hover:bg-emerald-50 flex-1"
              onClick={() => handleResolve("RELEASE_SELLER")}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
              Release to Seller
            </Button>
            <Button
              variant="outline"
              className="border-blue-400 text-blue-600 hover:bg-blue-50 flex-1"
              onClick={() => handleResolve("REFUND_BUYER")}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              Refund Buyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
    </div>
  );
};

export default AdminDeals;