import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";

const config: any = {
  active: {
    label: "Active",
    icon: TrendingUp,
    className: "bg-blue-500/10 text-blue-600",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "bg-emerald-500/10 text-emerald-600",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-rose-500/10 text-rose-500",
  },
  expired: {
    label: "Expired",
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertCircle,
    className: "bg-muted text-muted-foreground",
  },
};

const BidStatusBadge = ({ status }: { status: string }) => {
  const cfg = config[status?.toLowerCase()];
  if (!cfg) return <Badge variant="secondary">{status}</Badge>;
  const Icon = cfg.icon;
  return (
    <Badge className={cfg.className}>
      <Icon className="h-3 w-3 mr-1" />
      {cfg.label}
    </Badge>
  );
};

export default BidStatusBadge;