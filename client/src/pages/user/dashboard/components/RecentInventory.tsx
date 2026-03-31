import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Diamond, ArrowUpRight, Plus, ImageOff } from "lucide-react";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  available:  { label: "Available",  className: "border-emerald-400 text-emerald-600" },
  listed:     { label: "Listed",     className: "border-blue-400 text-blue-600" },
  on_memo:    { label: "On Memo",    className: "border-amber-400 text-amber-600" },
  sold:       { label: "Sold",       className: "border-slate-400 text-slate-500" },
};

const RecentInventory = () => {
  const navigate = useNavigate();
  const { items, loading } = useAppSelector((s) => s.inventory);

  const recent = [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18 }}
    >
      <Card className="card-premium">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Diamond className="h-4 w-4 text-accent" />
            Recent Inventory
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary"
              onClick={() => navigate("/user/inventory/add")}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
            <button
              onClick={() => navigate("/user/inventory")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-10">
              <Diamond className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No inventory yet</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 gap-1.5 text-xs"
                onClick={() => navigate("/user/inventory/new")}
              >
                <Plus className="h-3.5 w-3.5" /> Add your first diamond
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((item) => {
                const cfg =
                  statusConfig[item.status] ?? statusConfig.available;
                return (
                  <motion.div
                    key={item._id}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() =>
                      navigate(`/user/inventory/${item._id}`)
                    }
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.carat}ct ·{" "}
                        {item.shape} ·{" "}
                        {item.color}/{item.clarity}
                      </p>
                    </div>

                    {/* Right side */}
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-sm font-semibold text-primary">
                        ${item.price?.toLocaleString()}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${cfg.className}`}
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentInventory;