import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "@/components/ui/card";
import {
  Diamond, Package, Gavel, Handshake,
  DollarSign, Award, ArrowUpRight,
} from "lucide-react";

const fmt = (n: number) => n?.toLocaleString() ?? "0";

const fmtVolume = (n: number) => {
  if (!n) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
};

const StatsGrid = () => {
  const navigate = useNavigate();

  const inventory = useAppSelector((s) => s.inventory);
  const auctions  = useAppSelector((s) => s.auction);
  const bids      = useAppSelector((s) => s.bid);
  const deals     = useAppSelector((s) => s.deal);
  const badges    = useAppSelector((s) => s.badge);

  const totalInventory = inventory.items.length;
  const activeListings = inventory.items.filter(
    (i) => i.status === "listed"
  ).length;
  const activeAuctions = auctions.myAuctions.filter(
    (a) => a.status === "active"
  ).length;

  // Bids I placed that are still active
  const activeBids = bids.myBids.filter((b) => b.status === "ACTIVE").length;

  // Deals in progress (buyer or seller)
  const activeDeals = deals.deals.filter(
    (d) =>
      d.status === "IN_ESCROW" ||
      d.status === "SHIPPED" ||
      d.status === "PAYMENT_PENDING"
  ).length;
  const completedDeals = deals.deals.filter(
    (d) => d.status === "COMPLETED"
  ).length;

  // Volume earned
  const totalVolume = deals.deals
    .filter((d) => d.status === "COMPLETED")
    .reduce((sum, d) => sum + (d.dealAmount ?? 0), 0);

  const earnedBadges = badges.myBadges.filter((b) => b.isEarned).length;

  const stats = [
    {
      label: "My Inventory",
      value: fmt(totalInventory),
      sub: `${activeListings} listed`,
      icon: Package,
      accent: false,
      route: "/user/inventory",
    },
    {
      label: "Active Auctions",
      value: fmt(activeAuctions),
      sub: `${auctions.myAuctions.length} total`,
      icon: Gavel,
      accent: true,
      route: "/user/listings",
    },
    {
      label: "My Bids",
      value: fmt(activeBids),
      sub: "currently active",
      icon: Diamond,
      accent: false,
      route: "/user/bids",
    },
    {
      label: "Active Deals",
      value: fmt(activeDeals),
      sub: `${completedDeals} completed`,
      icon: Handshake,
      accent: false,
      route: "/user/deals",
    },
    {
      label: "Total Volume",
      value: fmtVolume(totalVolume),
      sub: "from completed deals",
      icon: DollarSign,
      accent: true,
      route: "/user/deals",
    },
    {
      label: "Badges Earned",
      value: `${earnedBadges}/${badges.myBadges.length}`,
      sub: "achievements",
      icon: Award,
      accent: false,
      route: "/user/profile",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 + i * 0.04 }}
          whileHover={{ y: -2 }}
        >
          <Card
            onClick={() => navigate(s.route)}
            className={`card-premium cursor-pointer hover:shadow-premium transition-all duration-200 group ${
              s.accent ? "border-accent/30" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                    s.accent
                      ? "bg-accent/15 group-hover:bg-accent/25"
                      : "bg-muted group-hover:bg-muted/80"
                  }`}
                >
                  <s.icon
                    className={`h-4 w-4 ${s.accent ? "text-accent" : "text-muted-foreground"}`}
                  />
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </div>
              <p className="text-2xl font-display font-bold text-primary leading-none">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-tight">
                {s.label}
              </p>
              {s.sub && (
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {s.sub}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;