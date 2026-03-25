import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Handshake,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Loader2,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import DealCard from "./components/DealCard";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { dealActions } from "@/store/slices/dealSlice";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const DealsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { deals, loading } = useAppSelector((s) => s.deal);

    useEffect(() => {
        dispatch(dealActions.fetchDealsRequest());
    }, [dispatch]);

    // ✅ CHAT FUNCTION
    const handleStartChat = async (deal: any) => {
        try {
            const res = await api.post("/chats/initiate", {
                participantId: deal.sellerId,
                contextType: "DEAL",
                contextId: deal.id,
            });

            const conversationId = res.data.data._id;

            navigate(`/user/messages?id=${conversationId}`);
        } catch (err) {
            console.error("Chat error:", err);
        }
    };

    const sorted = [...deals].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    const stats = [
        {
            label: "Total Deals",
            value: deals.length,
            icon: Handshake,
            color: "text-primary",
        },
        {
            label: "Active",
            value: deals.filter(
                (d) =>
                    !["COMPLETED", "CANCELLED", "DISPUTED"].includes(
                        d.status
                    )
            ).length,
            icon: Clock,
            color: "text-blue-600",
        },
        {
            label: "Completed",
            value: deals.filter((d) => d.status === "COMPLETED")
                .length,
            icon: CheckCircle2,
            color: "text-emerald-600",
        },
        {
            label: "Disputed",
            value: deals.filter((d) => d.status === "DISPUTED")
                .length,
            icon: AlertTriangle,
            color: "text-rose-500",
        },
    ];

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
        sellerId: (d.sellerId as any)?._id || d.sellerId,
        seller: (d.sellerId as any)?.name || "Seller",
        amount: d.dealAmount,
        status: d.status,
        createdAt: d.createdAt,
        thumbnail: (d.inventoryId as any)?.images?.[0],
    }));

    return (
        <DashboardShell>
            <div className="p-3 lg:p-2 space-y-8">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-semibold">Deals</h1>
                </motion.div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <Card key={s.label}>
                            <CardContent className="p-4 flex gap-2 items-center">
                                <s.icon />
                                <div>
                                    <p>{s.value}</p>
                                    <p className="text-xs">{s.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* DEAL LIST */}
                {loading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    dealCards.map((deal, i) => (
                        <DealCard
                            key={deal.id}
                            deal={deal}
                            index={i}
                            onStartChat={handleStartChat} // ✅ HERE
                        />
                    ))
                )}
            </div>
        </DashboardShell>
    );
};

export default DealsPage;