import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { adminActions } from "@/store/slices/adminSlice";
import { motion } from "framer-motion";
import {
  Users, ShieldCheck, Megaphone, Handshake, Gavel,
  TrendingUp, DollarSign, ArrowUpRight, Loader2,
  AlertTriangle, Diamond, Package, BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* ── helpers ── */
const fmt = (n: number) => n?.toLocaleString() ?? "0";

const fmtVolume = (n: number) => {
  if (!n) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

/* ── stat card ── */
const StatCard = ({
  label, value, sub, icon: Icon, accent = false, onClick,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  accent?: boolean;
  onClick?: () => void;
}) => (
  <Card
    onClick={onClick}
    className={`card-premium transition-all duration-200 ${onClick ? "cursor-pointer hover:shadow-premium hover:-translate-y-0.5" : ""}`}
  >
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-display font-bold text-primary">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
          accent ? "bg-accent/15" : "bg-muted"
        }`}>
          <Icon className={`h-5 w-5 ${accent ? "text-accent" : "text-muted-foreground"}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ── mini status row ── */
const StatusRow = ({
  label, count, color,
}: {
  label: string;
  count: number;
  color: string;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-muted-foreground capitalize">{label}</span>
    </div>
    <span className="text-sm font-semibold text-primary">{fmt(count)}</span>
  </div>
);

/* ════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, statsLoading, statsError } = useAppSelector((s) => s.admin);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(adminActions.fetchStatsRequest());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <p className="text-muted-foreground">{statsError ?? "Failed to load stats."}</p>
        <Button variant="outline" onClick={() => dispatch(adminActions.fetchStatsRequest())}>
          Retry
        </Button>
      </div>
    );
  }

  const { overview, users, kyc, advertisements, deals, auctions, inventory } = stats;

  /* disputed count */
  const disputedCount = deals?.stats?.DISPUTED ?? 0;

  /* KYC pending */
  const kycPending = kyc?.stats?.pending ?? kyc?.stats?.PENDING ?? 0;

  /* ads pending */
  const adsPending = advertisements?.stats?.PENDING ?? 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* ── Header ── */}
      <motion.div {...fadeUp(0)} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Welcome, {user?.name?.split(" ")[0] ?? "Admin"}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Platform overview · {new Date().toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* Alert badges */}
        <div className="hidden sm:flex items-center gap-2">
          {kycPending > 0 && (
            <button onClick={() => navigate("/admin/kyc")}>
              <Badge className="gap-1.5 bg-amber-500/10 text-amber-600 border-amber-400 hover:bg-amber-500/20 cursor-pointer">
                <ShieldCheck className="h-3 w-3" />
                {kycPending} KYC pending
              </Badge>
            </button>
          )}
          {disputedCount > 0 && (
            <button onClick={() => navigate("/admin/deals")}>
              <Badge className="gap-1.5 bg-rose-500/10 text-rose-600 border-rose-400 hover:bg-rose-500/20 cursor-pointer">
                <AlertTriangle className="h-3 w-3" />
                {disputedCount} dispute{disputedCount > 1 ? "s" : ""}
              </Badge>
            </button>
          )}
          {adsPending > 0 && (
            <button onClick={() => navigate("/admin/ads")}>
              <Badge className="gap-1.5 bg-blue-500/10 text-blue-600 border-blue-400 hover:bg-blue-500/20 cursor-pointer">
                <Megaphone className="h-3 w-3" />
                {adsPending} ad{adsPending > 1 ? "s" : ""} pending
              </Badge>
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Overview stat cards ── */}
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={fmt(overview?.totalUsers)}
          sub={`${fmt(users?.byRole?.user ?? 0)} buyers · ${fmt(users?.byRole?.admin ?? 0)} admins`}
          icon={Users}
          accent
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          label="Total Deals"
          value={fmt(overview?.totalDeals)}
          sub={`${fmt(deals?.stats?.COMPLETED ?? 0)} completed`}
          icon={Handshake}
          onClick={() => navigate("/admin/deals")}
        />
        <StatCard
          label="Total Volume"
          value={fmtVolume(overview?.totalVolume)}
          sub={`Avg ${fmtVolume(overview?.averageDealSize)} / deal`}
          icon={DollarSign}
          accent
        />
        <StatCard
          label="Active Auctions"
          value={fmt(auctions?.stats?.ACTIVE ?? 0)}
          sub={`${fmt(auctions?.total ?? 0)} total auctions`}
          icon={Gavel}
          onClick={() => navigate("/admin/auctions")}
        />
      </motion.div>

      {/* ── Middle row: breakdown cards ── */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Users breakdown */}
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" /> Users
              </span>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-display font-bold text-primary mb-3">
              {fmt(users?.total)}
            </p>
            <Separator className="mb-3" />
            {Object.entries(users?.byRole ?? {}).map(([role, count]) => (
              <StatusRow
                key={role}
                label={role}
                count={count as number}
                color="bg-blue-400"
              />
            ))}
          </CardContent>
        </Card>

        {/* KYC breakdown */}
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" /> KYC
              </span>
              <button
                onClick={() => navigate("/admin/kyc")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-display font-bold text-primary mb-3">
              {fmt(kyc?.total)}
            </p>
            <Separator className="mb-3" />
            {Object.entries(kyc?.stats ?? {}).map(([status, count]) => (
              <StatusRow
                key={status}
                label={status}
                count={count as number}
                color={
                  status === "approved" || status === "APPROVED" ? "bg-emerald-400" :
                  status === "rejected" || status === "REJECTED" ? "bg-rose-400" :
                  "bg-amber-400"
                }
              />
            ))}
          </CardContent>
        </Card>

        {/* Deals breakdown */}
        <Card className="card-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Handshake className="h-4 w-4 text-muted-foreground" /> Deals
              </span>
              <button
                onClick={() => navigate("/admin/deals")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-display font-bold text-primary mb-3">
              {fmt(deals?.total)}
            </p>
            <Separator className="mb-3" />
            {Object.entries(deals?.stats ?? {}).slice(0, 5).map(([status, count]) => (
              <StatusRow
                key={status}
                label={status.replace("_", " ").toLowerCase()}
                count={count as number}
                color={
                  status === "COMPLETED"  ? "bg-emerald-400" :
                  status === "DISPUTED"   ? "bg-rose-400"    :
                  status === "CANCELLED"  ? "bg-slate-400"   :
                  status === "IN_ESCROW"  ? "bg-blue-400"    :
                  "bg-amber-400"
                }
              />
            ))}
          </CardContent>
        </Card>

        {/* Inventory + Ads breakdown */}
        <div className="space-y-4">
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" /> Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-display font-bold text-primary mb-3">
                {fmt(inventory?.total)}
              </p>
              <Separator className="mb-3" />
              {Object.entries(inventory?.stats ?? {}).slice(0, 3).map(([status, count]) => (
                <StatusRow
                  key={status}
                  label={status.toLowerCase()}
                  count={count as number}
                  color="bg-cyan-400"
                />
              ))}
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-muted-foreground" /> Ads
                </span>
                <button
                  onClick={() => navigate("/admin/ads")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-display font-bold text-primary mb-3">
                {fmt(advertisements?.total)}
              </p>
              <Separator className="mb-3" />
              {Object.entries(advertisements?.stats ?? {}).map(([status, count]) => (
                <StatusRow
                  key={status}
                  label={status.toLowerCase()}
                  count={count as number}
                  color={
                    status === "APPROVED" ? "bg-emerald-400" :
                    status === "REJECTED" ? "bg-rose-400"    :
                    status === "DISABLED" ? "bg-slate-400"   :
                    "bg-amber-400"
                  }
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* ── Bottom row: recent users + deal volume + growth ── */}
      <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent users */}
        <Card className="card-premium lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" /> Recent Users
              </span>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {(users?.recent ?? []).slice(0, 5).map((u) => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {u.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] shrink-0 ${
                    u.isBlocked
                      ? "border-rose-400 text-rose-600"
                      : "border-emerald-400 text-emerald-600"
                  }`}
                >
                  {u.isBlocked ? "Blocked" : "Active"}
                </Badge>
              </div>
            ))}
            {(users?.recent ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No users yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Deal volume stats */}
        <Card className="card-premium lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" /> Deal Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {[
              { label: "Total Volume",   value: fmtVolume(deals?.volume?.total) },
              { label: "Average Deal",   value: fmtVolume(deals?.volume?.avg)   },
              { label: "Largest Deal",   value: fmtVolume(deals?.volume?.max)   },
              { label: "Smallest Deal",  value: fmtVolume(deals?.volume?.min)   },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-primary">{value}</span>
              </div>
            ))}

            <Separator />

            {/* Disputed alert */}
            {disputedCount > 0 ? (
              <button
                onClick={() => navigate("/admin/deals")}
                className="w-full flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 text-left hover:bg-rose-100 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
                    {disputedCount} dispute{disputedCount > 1 ? "s" : ""} need attention
                  </p>
                  <p className="text-xs text-rose-500">Click to resolve →</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                  No active disputes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent deals */}
        <Card className="card-premium lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" /> Recent Deals
              </span>
              <button
                onClick={() => navigate("/admin/deals")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {(deals?.recent ?? []).slice(0, 5).map((d) => (
              <div key={d._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Diamond className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {d.buyerId?.name} → {d.sellerId?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtVolume(d.dealAmount)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] shrink-0 ${
                    d.status === "COMPLETED"  ? "border-emerald-400 text-emerald-600" :
                    d.status === "DISPUTED"   ? "border-rose-400   text-rose-600"    :
                    d.status === "CANCELLED"  ? "border-slate-400  text-slate-500"   :
                    "border-amber-400 text-amber-600"
                  }`}
                >
                  {d.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
            {(deals?.recent ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No deals yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default AdminDashboard;