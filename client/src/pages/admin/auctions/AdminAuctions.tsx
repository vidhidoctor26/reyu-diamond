import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { adminActions } from "@/store/slices/adminSlice";
import { motion } from "framer-motion";
import { Search, Loader2, Clock, TrendingUp,DollarSign, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const statusConfig: Record<string, { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "border-slate-400  text-slate-500  bg-slate-50  dark:bg-slate-800/20" },
  active: { label: "Active", color: "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
  ended: { label: "Ended", color: "border-blue-400   text-blue-600   bg-blue-50   dark:bg-blue-900/20" },
  cancelled: { label: "Cancelled", color: "border-rose-400   text-rose-600   bg-rose-50   dark:bg-rose-900/20" },
};

const getTimeLeft = (endDate: string): string => {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d > 0) return `${d}d ${h}h`;
  return `${h}h left`;
};

const AdminAuctions = () => {
  const dispatch = useAppDispatch();
  const { auctions, auctionsLoading } = useAppSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"ALL" | "active" | "ended" | "cancelled">("ALL");

  useEffect(() => {
    dispatch(adminActions.fetchAuctionsRequest());
  }, [dispatch]);

  const counts = {
    ALL: auctions.length,
    active: auctions.filter((a) => a.status === "active").length,
    ended: auctions.filter((a) => a.status === "ended").length,
    cancelled: auctions.filter((a) => a.status === "cancelled").length,
  };

  const filtered = auctions.filter((a) => {
    const inv = a.inventoryId;
    const matchSearch =
      a.sellerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv?.title?.toLowerCase().includes(search.toLowerCase()) ||
      a._id.includes(search);
    const matchTab = tab === "ALL" || a.status === tab;
    return matchSearch && matchTab;
  });

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Auctions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {counts.active} live auctions · {auctions.length} total
          </p>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["ALL", "active", "ended", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`p-4 rounded-xl border text-left transition-all ${tab === s
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
                }`}
            >
              <p className="text-2xl font-display font-bold text-primary">
                {counts[s as keyof typeof counts] ?? auctions.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 capitalize">{s}</p>
            </button>
          ))}
        </div>

        <Card className="card-premium">
          <CardHeader className="pb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by seller, diamond or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {auctionsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auction ID</TableHead>
                    <TableHead>Diamond</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Current Bid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Left</TableHead>
                    <TableHead>Start Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => {
                    const sc = statusConfig[a.status] ?? statusConfig.DRAFT;
                    const inv = a.inventoryId;
                    return (
                      <TableRow key={a._id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {a._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{inv?.title ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">
                              {inv?.carat && `${inv.carat}ct`}
                              {inv?.color && ` · ${inv.color}`}
                              {inv?.clarity && ` · ${inv.clarity}`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{a.sellerId?.name}</p>
                            <p className="text-xs text-muted-foreground">{a.sellerId?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            {a.basePrice.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {a.currentBid > 0 ? (
                            <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                              <TrendingUp className="h-3.5 w-3.5" />
                              ${a.currentBid.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No bids</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={sc.color}>{sc.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {a.status === "active" ? (
                            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                              <Clock className="h-3 w-3" />
                              {getTimeLeft(a.endDate)}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(a.startDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric",
                            })}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                        No auctions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminAuctions;