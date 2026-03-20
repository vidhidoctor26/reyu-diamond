import { Clock, CreditCard, Package, Truck, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DealStatus } from "./DealStatusBadge";

const statusIcons: Record<string, any> = {
    CREATED: Clock,
    PAYMENT_PENDING: CreditCard,
    PAYMENT_FAILED: CreditCard,
    IN_ESCROW: Package,
    SHIPPED: Truck,
    DELIVERED: CheckCircle2,
    COMPLETED: CheckCircle2,
    DISPUTED: AlertTriangle,
    CANCELLED: Ban,
};

const statusLabels: Record<string, string> = {
    CREATED: "Deal Created",
    PAYMENT_PENDING: "Payment Pending",
    PAYMENT_FAILED: "Payment Failed",
    IN_ESCROW: "Payment in Escrow",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    DISPUTED: "Disputed",
    CANCELLED: "Cancelled",
};

const statusOrder: DealStatus[] = [
    "CREATED", "PAYMENT_PENDING", "PAYMENT_FAILED", "IN_ESCROW", "SHIPPED", "DELIVERED", "COMPLETED"
];


export interface HistoryEntry {
    status: DealStatus;
    changedAt: string;
    note?: string;
}

interface Props {
    currentStatus: DealStatus;
    history?: HistoryEntry[];
}

const DealTimeline = ({ currentStatus, history = [] }: Props) => {
    const currentIdx = statusOrder.indexOf(currentStatus);

    const steps = statusOrder.map((s, i) => {
        const historyEntry = history.find((h) => h.status === s);
        return {
            status: s,
            label: statusLabels[s],
            timestamp: historyEntry?.changedAt,
            note: historyEntry?.note,
            completed: i < currentIdx,
            current: i === currentIdx,
        };
    });

    return (
        <Card className="card-premium">
            <CardHeader>
                <CardTitle className="font-display text-lg">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {steps.map((step, i) => {
                        const Icon = statusIcons[step.status] ?? Clock;
                        return (
                            <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                                <div className="flex flex-col items-center">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${step.completed ? "bg-emerald-500/10 text-emerald-600" :
                                            step.current ? "bg-primary text-primary-foreground ring-2 ring-primary/20" :
                                                "bg-muted text-muted-foreground"
                                        }`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-px flex-1 mt-1 ${step.completed || step.current ? "bg-emerald-300" : "bg-border"
                                            }`} />
                                    )}
                                </div>
                                <div className="pt-1.5">
                                    <p className={`text-sm font-medium ${step.current ? "text-primary" :
                                            step.completed ? "text-foreground" :
                                                "text-muted-foreground"
                                        }`}>
                                        {step.label}
                                    </p>
                                    {step.timestamp && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(step.timestamp).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric",
                                                hour: "2-digit", minute: "2-digit"
                                            })}
                                        </p>
                                    )}
                                    {step.note && (
                                        <p className="text-xs text-muted-foreground mt-0.5 italic">{step.note}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default DealTimeline;