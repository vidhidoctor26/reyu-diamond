import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, TrendingUp, Gavel, Play } from "lucide-react";

const stats = [
  { label: "Active Listings", value: "12", icon: Play, color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Total Bids", value: "34", icon: Gavel, color: "bg-accent/10 text-accent" },
  { label: "Total Views", value: "1.2K", icon: Eye, color: "bg-blue-500/10 text-blue-600" },
  { label: "Sold Items", value: "8", icon: TrendingUp, color: "bg-violet-500/10 text-violet-600" },
];

interface ListingsStatsProps {
  listings?: any[];
  loading?: boolean;
}

const ListingsStats = (_props?: ListingsStatsProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
  >
    {stats.map((stat, i) => (
      <Card key={i} className="card-premium">
        <CardContent className="p-6 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-display text-2xl font-semibold text-primary">{stat.value}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </motion.div>
);

export default ListingsStats;
