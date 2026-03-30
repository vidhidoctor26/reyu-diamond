import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string;
  color: string;
}

const stats: Stat[] = [
  { label: "Total Ads", value: "5", color: "text-primary" },
  { label: "Active",    value: "1", color: "text-emerald-600" },
  { label: "Pending",   value: "1", color: "text-amber-600" },
  { label: "Expired",   value: "1", color: "text-muted-foreground" },
];

const AdStats = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <Card key={stat.label} className="border-border/50">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default AdStats;