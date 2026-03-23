import { useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Diamond, Eye, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux";

const InventoryStats = () => {
  const items = useAppSelector((s) => s.inventory.items);

  const stats = useMemo(() => {
    const total = items.length;
    const available = items.filter((i) => i.status === "available").length;
    const listed = items.filter((i) => i.status === "listed").length;
    const onMemo = items.filter((i) => i.status === "on_memo").length;

    return [
      { label: "Total Items", value: total, icon: Package },
      { label: "Available", value: available, icon: Diamond },
      { label: "Listed", value: listed, icon: Eye },
      { label: "On Memo", value: onMemo, icon: Clock },
    ];
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, i) => (
        <Card key={i} className="card-premium">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <stat.icon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="font-display text-2xl font-semibold text-primary">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};

export default InventoryStats;