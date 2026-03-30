import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import DashboardShell from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";

import DealSummary from "./components/DealSummary";
import DealTimeline from "./components/DealTimeline";
import DealActionPanel from "./components/DealActionPanel";
import StripePaymentModal from "./components/StripePaymentModal";
import ShipModal from "./components/ShipModal";

import { dealActions } from "@/store/slices/dealSlice";
import type { RootState } from "@/store";

import { useRatings } from "@/pages/user/ratings/hooks/useRatings";
import RatingModal from "@/pages/user/ratings/components/RatingModal";
import RatingBanner from "@/pages/user/ratings/components/RatingBanner";

const DealDetail = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedDeal: deal,
    loading,
    actionLoading,
    pdfLoading,
    clientSecret,
  } = useAppSelector((state: RootState) => state.deal);

  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (dealId) dispatch(dealActions.fetchDealByIdRequest(dealId));

    return () => {
      dispatch(dealActions.clearSelectedDeal());
      dispatch(dealActions.clearClientSecret());
    };
  }, [dealId, dispatch]);

  const userRole =
    deal?.buyerId?._id === user?._id ? "buyer" : "seller";

  const targetUserId =
    userRole === "buyer"
      ? deal?.sellerId?._id
      : deal?.buyerId?._id;

  // ======================
  // STATE
  // ======================
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shipModal, setShipModal] = useState(false);

  // ======================
  // ⭐ RATING
  // ======================
  const {
    showRatingModal,
    isRated,
    isSubmitting: isRatingSubmitting,
    submitRating,
    dismissRating,
    openRatingModal,
  } = useRatings(
    deal?._id ?? "",
    deal?.status ?? "",
    targetUserId ?? ""
  );

  // ======================
  // ACTIONS
  // ======================

  // ✅ MARK SHIPPED
  const handleMarkShipped = (courier: string, trackingNumber: string) => {
    if (!deal) return;

    dispatch(
      dealActions.markShippedRequest({
        dealId: deal._id,
        courier,
        trackingNumber,
        onSuccess: () => {
          setShipModal(false);
          toast.success("Marked as shipped!");
        },
        onError: (msg) => toast.error(msg),
      })
    );
  };

  // ✅ CONFIRM DELIVERY
  const handleConfirmDelivery = () => {
    if (!deal) return;

    dispatch(
      dealActions.confirmDeliveredRequest({
        dealId: deal._id,
        onSuccess: () => {
          toast.success("Delivery confirmed & payment released!");
        },
        onError: (msg) => toast.error(msg),
      })
    );
  };

  // ✅ RAISE DISPUTE
  const handleRaiseDispute = (reason: string) => {
    if (!deal) return;

    dispatch(
      dealActions.raiseDisputeRequest({
        dealId: deal._id,
        reason,
        onSuccess: () => {
          toast.success("Dispute raised!");
        },
        onError: (msg) => toast.error(msg),
      })
    );
  };

  // ✅ PAYMENT
  const handlePayment = () => {
    if (!deal) return;

    dispatch(
      dealActions.createPaymentIntentRequest({
        dealId: deal._id,
        onSuccess: () => {
          setPaymentModalOpen(true);
          toast.success("Proceed to payment");
        },
        onError: (msg) => toast.error(msg),
      })
    );
  };

  // ✅ DOWNLOAD PDF
  const handleDownloadPDF = () => {
    if (!deal) return;

    dispatch(
      dealActions.generatePdfRequest({
        dealId: deal._id,
        onSuccess: (url) => {
          window.open(url, "_blank");
          toast.success("PDF ready!");
        },
        onError: (msg) => toast.error(msg),
      })
    );
  };

  // ✅ RELEASE ESCROW
  const handleReleaseEscrow = () => {
    if (!deal) return;

    dispatch(
      dealActions.releaseEscrowRequest({
        dealId: deal._id,
        onSuccess: () => {
          toast.success("Escrow released! Deal completed.");
        },
        onError: (msg) => toast.error(msg),
      })
    );
  };

  // ======================
  // LOADING STATE
  // ======================
  if (loading || !deal) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  const inv = deal.inventoryId as any;

  const diamond = {
    shape: inv?.shape || "Diamond",
    carat: String(inv?.carat || ""),
    color: inv?.color || "-",
    clarity: inv?.clarity || "-",
    cut: inv?.cut || "-",
  };

  return (
    <DashboardShell>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">

        <motion.div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/user/deals")}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Deals
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-4">
            <DealSummary
              diamond={diamond}
              amount={deal.dealAmount}
              buyer={deal.buyerId?.name}
              seller={deal.sellerId?.name}
              dealId={deal._id}
              status={deal.status}
              createdAt={deal.createdAt}
              thumbnail={inv?.images?.[0]}
              onDownloadPdf={handleDownloadPDF}
              pdfLoading={pdfLoading}
            />
          </div>

          <div className="lg:col-span-5">
            <DealTimeline
              currentStatus={deal.status}
              history={deal.history}
            />
          </div>

          <div className="lg:col-span-3 space-y-4">

            {/* ✅ FIXED ACTION PANEL */}
            <DealActionPanel
              status={deal.status}
              userRole={userRole}
              actionLoading={actionLoading}
              onMarkShipped={handleMarkShipped}
              onConfirmDelivery={handleConfirmDelivery}
              onRaiseDispute={handleRaiseDispute}
              onPayment={handlePayment}
              onDownloadPdf={handleDownloadPDF}
              onReleaseEscrow={handleReleaseEscrow}
              pdfLoading={pdfLoading}
            />

            {deal.status === "COMPLETED" && userRole === "buyer" && (
              <RatingBanner
                isRated={isRated}
                onRateNow={openRatingModal}
              />
            )}
          </div>
        </div>
      </div>

      {/* SHIP MODAL */}
      <ShipModal
        open={shipModal}
        onOpenChange={setShipModal}
        onConfirm={handleMarkShipped}
        loading={actionLoading}
      />

      {/* PAYMENT MODAL */}
      {clientSecret && (
        <StripePaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          clientSecret={clientSecret}
          amount={deal.dealAmount}
          dealId={deal._id}
          onSuccess={() => {
            setPaymentModalOpen(false);
            toast.success("Payment successful!");
          }}
        />
      )}

      {/* RATING MODAL */}
      <RatingModal
        open={showRatingModal}
        onSubmit={submitRating}
        onDismiss={dismissRating}
        isSubmitting={isRatingSubmitting}
        dealInfo={{
          shape: diamond.shape,
          carat: diamond.carat,
          dealId: deal._id,
        }}
      />
    </DashboardShell>
  );
};

export default DealDetail;