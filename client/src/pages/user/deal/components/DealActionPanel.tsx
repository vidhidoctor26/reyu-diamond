import { useState } from "react";
import {
    Truck, CheckCircle2, AlertTriangle, CreditCard,
    Download, Loader2, Ban,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import ShipModal from "./ShipModal";
import { type DealStatus } from "./DealStatusBadge";

interface Props {
    status: DealStatus;
    userRole: "buyer" | "seller";
    actionLoading: boolean;
    onMarkShipped: (courier: string, trackingNumber: string) => void;
    onConfirmDelivery: () => void;
    onRaiseDispute: (reason: string) => void;
    onPayment: () => void;
    onDownloadPdf: () => void;
    pdfLoading: boolean;
}

const DealActionPanel = ({
    status, userRole, actionLoading,
    onMarkShipped, onConfirmDelivery, onRaiseDispute,
    onPayment, onDownloadPdf, pdfLoading,
}: Props) => {
    const [shipModal, setShipModal] = useState(false);
    const [confirmDelivery, setConfirmDelivery] = useState(false);
    const [disputeModal, setDisputeModal] = useState(false);
    const [disputeReason, setDisputeReason] = useState("");

    const renderContent = () => {
        if (status === "CANCELLED") return (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Ban className="h-5 w-5" />
                <span className="text-sm">This deal has been cancelled.</span>
            </div>
        );

        if (status === "DISPUTED") return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium text-sm">Dispute Under Review</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Our team is reviewing this dispute. You'll be notified once a resolution is reached.
                </p>
            </div>
        );

        if (status === "COMPLETED") return (
            <Button onClick={onDownloadPdf} disabled={pdfLoading} className="w-full gap-2">
                {pdfLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Download className="h-4 w-4" />
                }
                Download PDF
            </Button>
        );

        if (userRole === "buyer") {
            if (status === "CREATED") return (
                <Button onClick={onPayment} disabled={actionLoading} className="w-full gap-2">
                    {actionLoading
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <CreditCard className="h-4 w-4" />
                    }
                    Proceed to Payment
                </Button>
            );
            if (status === "SHIPPED") return (
                <Button onClick={() => setConfirmDelivery(true)} disabled={actionLoading} className="w-full gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Confirm Delivery
                </Button>
            );
            if (status === "DELIVERED") return (
                <Button variant="destructive" onClick={() => setDisputeModal(true)} disabled={actionLoading} className="w-full gap-2">
                    <AlertTriangle className="h-4 w-4" /> Raise Dispute
                </Button>
            );
            return <p className="text-sm text-muted-foreground">Waiting for seller action.</p>;
        }

        // Seller
        if (status === "CREATED" || status === "PAYMENT_PENDING") return (
            <p className="text-sm text-muted-foreground">Waiting for buyer payment.</p>
        );
        if (status === "IN_ESCROW") return (
            <Button onClick={() => setShipModal(true)} disabled={actionLoading} className="w-full gap-2">
                <Truck className="h-4 w-4" /> Mark as Shipped
            </Button>
        );
        if (status === "DELIVERED") return (
            <p className="text-sm text-muted-foreground">Awaiting buyer confirmation.</p>
        );

        return <p className="text-sm text-muted-foreground">No actions available.</p>;
    };

    return (
        <>
            <Card className="card-premium">
                <CardHeader>
                    <CardTitle className="font-display text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent>{renderContent()}</CardContent>
            </Card>

            {/* Ship Modal */}
            <ShipModal
                open={shipModal}
                onOpenChange={setShipModal}
                onConfirm={onMarkShipped}
                loading={actionLoading}
            />

            {/* Confirm Delivery */}
            <AlertDialog open={confirmDelivery} onOpenChange={setConfirmDelivery}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please confirm you have received the diamond. This will release payment to the seller.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { setConfirmDelivery(false); onConfirmDelivery(); }}>
                            {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dispute Modal */}
            <Dialog open={disputeModal} onOpenChange={setDisputeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Raise a Dispute</DialogTitle>
                        <DialogDescription>Describe the issue with this transaction.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label>Reason</Label>
                        <Textarea
                            placeholder="Describe the issue..."
                            value={disputeReason}
                            onChange={(e) => setDisputeReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDisputeModal(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => { setDisputeModal(false); onRaiseDispute(disputeReason); }}
                            disabled={actionLoading || !disputeReason}
                        >
                            {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                            Submit Dispute
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DealActionPanel;