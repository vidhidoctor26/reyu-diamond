import { Star, Handshake, TrendingUp, Truck, XCircle } from "lucide-react";
import StatsCard from "./StatsCard";
import type { UserStats } from "@/types/profile";

interface StatsGridProps {
  stats: UserStats;
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  const items = [
    { label: "Average Rating", value: `${stats.averageRating}/5`, icon: Star, accent: true },
    { label: "Completed Deals", value: stats.completedDeals, icon: Handshake },
    { label: "Reputation Score", value: `${stats.reputationScore}%`, icon: TrendingUp, accent: true },
    { label: "Total Shipments", value: stats.totalShipments, icon: Truck },
    { label: "Cancelled Deals", value: stats.cancelledDeals, icon: XCircle },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item, i) => (
        <StatsCard key={item.label} {...item} delay={0.15 + i * 0.05} />
      ))}
    </div>
  );
};

export default StatsGrid;
