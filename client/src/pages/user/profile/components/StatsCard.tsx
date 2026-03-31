import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
  delay?: number;
}

const StatsCard = ({ label, value, icon: Icon, accent = false, delay = 0 }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`p-5 rounded-2xl border transition-shadow hover:shadow-md ${
      accent
        ? "bg-champagne/5 border-champagne/20"
        : "bg-card border-border"
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-xl ${accent ? "bg-champagne/10" : "bg-muted"}`}>
        <Icon className={`h-5 w-5 ${accent ? "text-champagne" : "text-muted-foreground"}`} />
      </div>
    </div>
    <p className="font-display text-2xl font-semibold text-primary">{value}</p>
    <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
  </motion.div>
);

export default StatsCard;
