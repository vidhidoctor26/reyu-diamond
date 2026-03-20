import { Card, CardContent } from "@/components/ui/card";
import { Gavel, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
}

const BidsStats = ({ stats }: Props) => {
  const items = [
    { label: "Total Bids",      value: stats.total,    icon: Gavel,        color: "bg-accent/10 text-accent"                  },
    { label: "Pending Review",  value: stats.pending,  icon: Clock,        color: "bg-amber-500/10 text-amber-600"            },
    { label: "Accepted",        value: stats.accepted, icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600"        },
    { label: "Rejected",        value: stats.rejected, icon: XCircle,      color: "bg-rose-500/10 text-rose-500"              },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((s) => (
        <Card key={s.label} className="card-premium">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-semibold">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BidsStats;