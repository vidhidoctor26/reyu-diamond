import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { ReactNode, ElementType } from "react";
// import { useEffect } from "react";

import { useAppSelector } from "@/hooks/redux";
// import { kycActions } from "@/store/slices/kycSlice";

/* ================= TYPES ================= */

export type KycStatusType = "PENDING" | "APPROVED" | "REJECTED";

/* ================= CONFIG ================= */

const STATUS_CONFIG = {
  PENDING: {
    badge: "Verification in Progress",
    title: "We're Reviewing Your Details",
    description:
      "Your documents are under verification. This usually takes 24–48 hours.",
    icon: Clock,
    infoBox: (
      <div className="mb-8 p-4 rounded-2xl bg-accent/20 border border-accent text-sm">
        You'll be notified once verification is completed.
      </div>
    ),
    action: (navigate: ReturnType<typeof useNavigate>) => (
      <Button
        variant="outline"
        className="px-8 h-12 rounded-xl"
        onClick={() => navigate("/user")}
      >
        Go to Dashboard
      </Button>
    ),
  },

  APPROVED: {
    badge: "Verification Successful",
    title: "KYC Approved",
    description:
      "Your identity has been successfully verified.",
    icon: CheckCircle2,
    infoBox: null,
    action: (navigate: ReturnType<typeof useNavigate>) => (
      <Button
        className="btn-premium px-10 h-12 rounded-xl"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  REJECTED: {
    badge: "Verification Failed",
    title: "KYC Rejected",
    description:
      "We couldn't verify your identity with the submitted documents.",
    icon: XCircle,
    infoBox: (
      <div className="mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive text-sm text-destructive">
        Please upload clearer documents.
      </div>
    ),
    action: (navigate: ReturnType<typeof useNavigate>) => (
      <Button
        className="btn-premium px-10 h-12 rounded-xl"
        onClick={() => navigate("/kyc/start")}
      >
        Resubmit KYC
        <RefreshCcw className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
} satisfies Record<
  KycStatusType,
  {
    badge: string;
    title: string;
    description: string;
    icon: ElementType;
    infoBox: ReactNode;
    action: (navigate: ReturnType<typeof useNavigate>) => ReactNode;
  }
>;

/* ================= COMPONENT ================= */

const KycStatus = () => {
  const navigate = useNavigate();

  const { kycStatus } = useAppSelector((state) => state.auth);

  if (!kycStatus) return null;

  if (kycStatus === "NOT_STARTED") {
    navigate("/kyc/start", { replace: true });
    return null;
  }

  const config = STATUS_CONFIG[kycStatus as KycStatusType];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4
    bg-[radial-gradient(ellipse_at_top,_hsl(var(--accent)/0.38),_transparent_65%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Card className="p-10 text-center">
          <div className="flex justify-center mb-6">
            <span className="badge">
              <ShieldCheck className="h-4 w-4" />
              {config.badge}
            </span>
          </div>

          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-accent flex items-center justify-center">
            <Icon className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-semibold mb-3">
            {config.title}
          </h1>

          <p className="text-muted-foreground mb-8">
            {config.description}
          </p>

          {config.infoBox}

          <div className="flex justify-center mt-6">
            {config.action(navigate)}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default KycStatus;
