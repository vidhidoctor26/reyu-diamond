import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import DealSummary from "./components/DealSummary";
import DealTimeline from "./components/DealTimeline";
import DealActionPanel from "./components/DealActionPanel";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { dealActions } from "@/store/slices/dealSlice";

const DealDetailPage = () => {
    const { dealId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedDeal, loading, actionLoading, pdfLoading } = useAppSelector((s) => s.deal);
    const { user } = useAppSelector((s) => s.auth);

    useEffect(() => {
        if (!dealId) return;
        dispatch(dealActions.fetchDealByIdRequest(dealId));
        return () => { dispatch(dealActions.clearSelectedDeal()); };
    }, [dealId, dispatch]);

    if (loading || !selectedDeal) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </DashboardShell>
        );
    }

    const inv = selectedDeal.inventoryId as any;
    const buyerId = (selectedDeal.buyerId as any)?._id || selectedDeal.buyerId;
    const sellerId = (selectedDeal.sellerId as any)?._id || selectedDeal.sellerId;
    const userRole: "buyer" | "seller" = buyerId === user?._id ? "buyer" : "seller";

    const diamond = {
        shape: inv?.shape || "Diamond",
        carat: String(inv?.carat || ""),
        color: inv?.color || "-",
        clarity: inv?.clarity || "-",
        cut: inv?.cut || "-",
    };

    const handleMarkShipped = (courier: string, trackingNumber: string) => {
        dispatch(dealActions.markShippedRequest({
            dealId: selectedDeal._id,
            courier,
            trackingNumber,
            onSuccess: () => toast.success(`Marked as shipped via ${courier}`),
            onError: (msg) => toast.error(msg),
        }));
    };

    const handleConfirmDelivery = () => {
        dispatch(dealActions.confirmDeliveredRequest({
            dealId: selectedDeal._id,
            onSuccess: () => toast.success("Delivery confirmed"),
            onError: (msg) => toast.error(msg),
        }));
    };

    const handleRaiseDispute = (reason: string) => {
        dispatch(dealActions.raiseDisputeRequest({
            dealId: selectedDeal._id,
            reason,
            onSuccess: () => toast.success("Dispute submitted"),
            onError: (msg) => toast.error(msg),
        }));
    };

    const handlePayment = () => {
        // Wire to payment gateway when ready
        toast.info("Payment gateway coming soon");
    };

    const handleDownloadPdf = () => {
        if (selectedDeal.pdfPath) {
            window.open(selectedDeal.pdfPath, "_blank");
            return;
        }
        dispatch(dealActions.generatePdfRequest({
            dealId: selectedDeal._id,
            onSuccess: (pdfUrl) => { window.open(pdfUrl, "_blank"); toast.success("PDF generated"); },
            onError: (msg) => toast.error(msg),
        }));
    };

    return (
        <DashboardShell>
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                    <Button variant="ghost" onClick={() => navigate("/user/deals")} className="gap-2 text-muted-foreground">
                        <ArrowLeft className="h-4 w-4" /> Back to Deals
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4">
                        <DealSummary
                            diamond={diamond}
                            amount={selectedDeal.dealAmount}
                            buyer={(selectedDeal.buyerId as any)?.name || "Buyer"}
                            seller={(selectedDeal.sellerId as any)?.name || "Seller"}
                            dealId={selectedDeal._id}
                            status={selectedDeal.status}
                            createdAt={selectedDeal.createdAt}
                            thumbnail={inv?.images?.[0]}
                            onDownloadPdf={handleDownloadPdf}
                            pdfLoading={pdfLoading}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-5">
                        <DealTimeline
                            currentStatus={selectedDeal.status}
                            history={selectedDeal.history.map((h) => ({
                                status: h.status,
                                changedAt: h.changedAt,
                                note: h.note,
                            }))}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
                        <DealActionPanel
                            status={selectedDeal.status}
                            userRole={userRole}
                            actionLoading={actionLoading}
                            onMarkShipped={handleMarkShipped}
                            onConfirmDelivery={handleConfirmDelivery}
                            onRaiseDispute={handleRaiseDispute}
                            onPayment={handlePayment}
                            onDownloadPdf={handleDownloadPdf}
                            pdfLoading={pdfLoading}
                        />
                    </motion.div>
                </div>
            </div>
        </DashboardShell>
    );
};

export default DealDetailPage;