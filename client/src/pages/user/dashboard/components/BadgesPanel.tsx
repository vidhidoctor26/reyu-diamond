import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, ArrowUpRight, Lock } from "lucide-react";
import type { BadgeTier } from "@/store/slices/badgeSlice";

const tierConfig: Record<BadgeTier, { color: string; bg: string; border: string; label: string; bar: string }> = {
  BRONZE:   { color: "text-amber-700",  bg: "bg-amber-50 dark:bg-amber-900/20",   border: "border-amber-200 dark:border-amber-800",   label: "Bronze",   bar: "bg-amber-500"   },
  SILVER:   { color: "text-slate-500",  bg: "bg-slate-50 dark:bg-slate-800/40",   border: "border-slate-200 dark:border-slate-700",   label: "Silver",   bar: "bg-slate-400"   },
  GOLD:     { color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-200 dark:border-yellow-800", label: "Gold",     bar: "bg-yellow-500"  },
  PLATINUM: { color: "text-cyan-600",   bg: "bg-cyan-50 dark:bg-cyan-900/20",     border: "border-cyan-200 dark:border-cyan-800",     label: "Platinum", bar: "bg-cyan-500"    },
  DIAMOND:  { color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20", border: "border-violet-200 dark:border-violet-800", label: "Diamond",  bar: "bg-violet-500"  },
};

/** Safely renders badge icon — handles CDN URLs, emoji, or fallback */
const BadgeIcon = ({ icon, size = "md" }: { icon: string; size?: "sm" | "md" }) => {
  const isUrl = typeof icon === "string" && (icon.startsWith("http") || icon.startsWith("/"));
  const wrapSz = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const imgSz  = size === "sm" ? "w-5 h-5"  : "w-6 h-6";

  if (isUrl) {
    return (
      <div className={`${wrapSz} rounded-xl bg-white/60 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0`}>
        <img
          src={icon}
          alt="badge"
          className={`${imgSz} object-contain`}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = "none";
            if (el.parentElement) el.parentElement.textContent = "🏅";
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${wrapSz} rounded-xl bg-white/60 dark:bg-white/10 flex items-center justify-center shrink-0`}>
      <span className="text-base leading-none">{icon || "🏅"}</span>
    </div>
  );
};

const BadgesPanel = () => {
  const navigate = useNavigate();
  const { myBadges, loading } = useAppSelector((s) => s.badge);

  const earned = myBadges.filter((b) => b.isEarned);
  const inProgress = myBadges
    .filter((b) => !b.isEarned && b.progress.percentage > 0)
    .sort((a, b) => b.progress.percentage - a.progress.percentage)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28 }}
    >
      <Card className="card-premium">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            Badges
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">
              {earned.length}/{myBadges.length} earned
            </span>
            <button
              onClick={() => navigate("/user/profile")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Earned badges */}
              {earned.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2.5">
                    Earned
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {earned.slice(0, 6).map((b) => {
                      const t = tierConfig[b.tier];
                      return (
                        <div
                          key={b.badgeId}
                          title={`${b.name} · ${t.label}`}
                          className={`group relative w-10 h-10 rounded-xl border ${t.bg} ${t.border} flex items-center justify-center cursor-default hover:scale-110 transition-transform`}
                        >
                          <BadgeIcon icon={b.icon} size="sm" />
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                            <div className="bg-popover border border-border rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                              <p className="text-[11px] font-semibold text-primary">{b.name}</p>
                              <p className={`text-[10px] ${t.color}`}>{t.label}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {earned.length > 6 && (
                      <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-[11px] text-muted-foreground font-semibold">
                        +{earned.length - 6}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* In progress */}
              {inProgress.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2.5">
                    In Progress
                  </p>
                  <div className="space-y-2.5">
                    {inProgress.map((b) => {
                      const t = tierConfig[b.tier];
                      return (
                        <div
                          key={b.badgeId}
                          className={`flex gap-3 p-3 rounded-xl border ${t.bg} ${t.border}`}
                        >
                          <BadgeIcon icon={b.icon} size="sm" />
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-semibold ${t.color} truncate`}>
                                {b.name}
                              </p>
                              <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                                {b.progress.current}/{b.progress.target}
                              </span>
                            </div>
                            <div className="relative h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${t.bar}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${b.progress.percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                              />
                            </div>
                            <p className="text-[10px] text-right text-muted-foreground/70">
                              {b.progress.percentage.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {myBadges.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                    <Lock className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-primary">No badges yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete deals to earn your first
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgesPanel;