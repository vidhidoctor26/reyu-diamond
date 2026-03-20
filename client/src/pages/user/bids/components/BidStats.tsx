import { Card, CardContent } from "@/components/ui/card";
import { Gavel, Activity, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  stats: {
    total: number;
    active: number;
    accepted: number;
    rejected: number;
  };
}

const BidStats = ({ stats }: Props) => {
  const items = [
    { label: "Total Bids", value: stats.total,    icon: Gavel        },
    { label: "Active",     value: stats.active,   icon: Activity     },
    { label: "Accepted",   value: stats.accepted, icon: CheckCircle2 },
    { label: "Rejected",   value: stats.rejected, icon: XCircle      },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((stat) => (
        <Card key={stat.label} className="card-premium">
          <CardContent className="p-6 flex items-center gap-4">
            <stat.icon className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold text-primary">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BidStats;