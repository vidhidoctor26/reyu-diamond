import { useEffect } from "react";
import { motion } from "framer-motion";
import { Handshake, AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import DealCard from "./components/DealCard";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { dealActions } from "@/store/slices/dealSlice";

const DealsPage = () => {
    const dispatch = useAppDispatch();
    const { deals, loading } = useAppSelector((s) => s.deal);

    useEffect(() => {
        dispatch(dealActions.fetchDealsRequest());
    }, [dispatch]);

    const sorted = [...deals].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const stats = [
        { label: "Total Deals", value: deals.length, icon: Handshake, color: "text-primary" },
        { label: "Active", value: deals.filter((d) => !["COMPLETED", "CANCELLED", "DISPUTED"].includes(d.status)).length, icon: Clock, color: "text-blue-600" },
        { label: "Completed", value: deals.filter((d) => d.status === "COMPLETED").length, icon: CheckCircle2, color: "text-emerald-600" },
        { label: "Disputed", value: deals.filter((d) => d.status === "DISPUTED").length, icon: AlertTriangle, color: "text-rose-500" },
    ];

    // Transform Deal → DealCardData
    const dealCards = sorted.map((d) => ({
        id: d._id,
        diamond: {
            shape: (d.inventoryId as any)?.shape || "Diamond",
            carat: String((d.inventoryId as any)?.carat || ""),
            color: (d.inventoryId as any)?.color || "-",
            clarity: (d.inventoryId as any)?.clarity || "-",
            cut: (d.inventoryId as any)?.cut || "-",
        },
        buyer: (d.buyerId as any)?.name || "Buyer",
        seller: (d.sellerId as any)?.name || "Seller",
        amount: d.dealAmount,
        status: d.status,
        createdAt: d.createdAt,
        thumbnail: (d.inventoryId as any)?.images?.[0],
    }));

    return (
        <DashboardShell>
            <div className="p-3 lg:p-2 space-y-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary">Deals</h1>
                    <p className="text-muted-foreground mt-1">Track all your diamond transactions</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((s) => (
                        <Card key={s.label} className="card-premium">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <s.icon className={`h-5 w-5 ${s.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-display font-semibold">{s.value}</p>
                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : dealCards.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No deals yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {dealCards.map((deal, i) => (
                            <DealCard key={deal.id} deal={deal} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardShell>
    );
};

export default DealsPage;