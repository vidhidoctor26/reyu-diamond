import { Badge } from "@/components/ui/badge";

export type DealStatus =
    | "CREATED"
    | "PAYMENT_PENDING"
    | "PAYMENT_FAILED"
    | "IN_ESCROW"
    | "SHIPPED"
    | "DELIVERED"
    | "COMPLETED"
    | "DISPUTED"
    | "CANCELLED";

export const dealStatusConfig: Record<DealStatus, { label: string; className: string }> = {
    CREATED: { label: "Created", className: "bg-muted text-muted-foreground border-border" },
    PAYMENT_PENDING: { label: "Payment Pending", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
    PAYMENT_FAILED: { label: "Payment Failed", className: "bg-red-500/10 text-red-600 border-red-200" },
    IN_ESCROW: { label: "In Escrow", className: "bg-blue-500/10 text-blue-600 border-blue-200" },
    SHIPPED: { label: "Shipped", className: "bg-purple-500/10 text-purple-600 border-purple-200" },
    DELIVERED: { label: "Delivered", className: "bg-teal-500/10 text-teal-600 border-teal-200" },
    COMPLETED: { label: "Completed", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
    DISPUTED: { label: "Disputed", className: "bg-rose-500/10 text-rose-500 border-rose-200" },
    CANCELLED: { label: "Cancelled", className: "bg-muted text-muted-foreground border-border" },
};

const DealStatusBadge = ({ status }: { status: DealStatus }) => {
    const sc = dealStatusConfig[status];
    if (!sc) return <Badge variant="outline">{status}</Badge>;
    return <Badge variant="outline" className={sc.className}>{sc.label}</Badge>;
};

export default DealStatusBadge;