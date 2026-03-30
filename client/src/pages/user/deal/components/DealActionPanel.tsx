import { useState } from "react";
import {
  Truck, CheckCircle2, AlertTriangle, CreditCard,
  Download, Loader2, Ban, DollarSign,
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
  onReleaseEscrow?: () => void;
  pdfLoading: boolean;
}

const DealActionPanel = ({
  status, userRole, actionLoading,
  onMarkShipped, onConfirmDelivery, onRaiseDispute,
  onPayment, onDownloadPdf, onReleaseEscrow, pdfLoading,
}: Props) => {

  const [shipModal, setShipModal] = useState(false);
  const [confirmDelivery, setConfirmDelivery] = useState(false);
  const [disputeModal, setDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [releaseEscrowModal, setReleaseEscrowModal] = useState(false);

  const safeConfirmDelivery = () => {
    if (typeof onConfirmDelivery === "function") {
      onConfirmDelivery();
    } else {
      console.error("❌ onConfirmDelivery not passed");
    }
  };

  const safeReleaseEscrow = () => {
    if (typeof onReleaseEscrow === "function") {
      onReleaseEscrow();
    } else {
      console.error("❌ onReleaseEscrow not passed");
    }
  };

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
          Our team is reviewing this dispute.
        </p>
      </div>
    );

    if (status === "COMPLETED") return (
      <Button onClick={onDownloadPdf} disabled={pdfLoading} className="w-full gap-2">
        {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Download Invoice
      </Button>
    );

    if (userRole === "buyer") {
      if (status === "CREATED" || status === "PAYMENT_FAILED") return (
        <Button onClick={onPayment} disabled={actionLoading} className="w-full gap-2">
          {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
          Proceed to Payment
        </Button>
      );

      if (status === "SHIPPED") return (
        <div className="space-y-2">
          <Button onClick={() => setConfirmDelivery(true)} className="w-full gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Confirm Delivery
          </Button>
          <Button variant="destructive" onClick={() => setDisputeModal(true)} className="w-full gap-2">
            <AlertTriangle className="h-4 w-4" /> Raise Dispute
          </Button>
        </div>
      );

      if (status === "DELIVERED") return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Delivery Confirmed</span>
          </div>
          {onReleaseEscrow && (
            <Button onClick={() => setReleaseEscrowModal(true)} className="w-full gap-2">
              <DollarSign className="h-4 w-4" />
              Release Escrow
            </Button>
          )}
          <Button variant="destructive" onClick={() => setDisputeModal(true)} className="w-full gap-2">
            <AlertTriangle className="h-4 w-4" /> Raise Dispute
          </Button>
        </div>
      );
    }

    if (status === "IN_ESCROW" && userRole === "seller") {
      return (
        <Button onClick={() => setShipModal(true)} className="w-full gap-2">
          <Truck className="h-4 w-4" />
          Mark as Shipped
        </Button>
      );
    }

    return <p className="text-sm text-muted-foreground">No actions available.</p>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>

      <ShipModal
        open={shipModal}
        onOpenChange={setShipModal}
        onConfirm={onMarkShipped}
        loading={actionLoading}
      />

      <AlertDialog open={confirmDelivery} onOpenChange={setConfirmDelivery}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              This will release payment to seller.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDelivery(false);
                safeConfirmDelivery();
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={disputeModal} onOpenChange={setDisputeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise Dispute</DialogTitle>
          </DialogHeader>

          <Textarea
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          />

          <DialogFooter>
            <Button onClick={() => setDisputeModal(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                onRaiseDispute(disputeReason);
                setDisputeModal(false);
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={releaseEscrowModal} onOpenChange={setReleaseEscrowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release Escrow</AlertDialogTitle>
            <AlertDialogDescription>
              This will complete the deal and transfer the payment to the seller. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setReleaseEscrowModal(false);
                safeReleaseEscrow();
              }}
            >
              Release Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DealActionPanel;