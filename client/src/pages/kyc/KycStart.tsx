import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { kycActions } from "@/store/slices/kycSlice";
import { authActions } from "@/store/slices/authSlice";



const KycStart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { kycStatus } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.kyc);

  /* ===============================
     START KYC
  =============================== */
  const handleStart = () => {
    dispatch(kycActions.goToStep("PERSONAL_DETAILS"));
    navigate("/kyc/personal-details");
  };

  /* ===============================
     SKIP KYC
  =============================== */
 const handleSkipKyc = () => {
  dispatch(kycActions.skipKyc());

  // 🔥 IMPORTANT: update auth slice
  dispatch(
    authActions.setCompliance({
      kycStatus: "PENDING",
    })
  );

  navigate("/user", { replace: true });
};

  /* ===============================
     UI
  =============================== */
  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-4 py-12
        bg-[radial-gradient(ellipse_at_top,_hsl(var(--accent)/0.38),_transparent_65%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <Card className="card-premium glass p-10">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent text-accent-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Identity Verification Required
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold text-center mb-3">
            Verify Your Identity
          </h1>

          <p className="text-muted-foreground text-center max-w-md mx-auto mb-10">
            To ensure secure diamond trading and enable escrow-backed payments,
            identity verification is required before accessing platform
            features.
          </p>

          {/* Benefits */}
          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <FileCheck className="h-4 w-4 text-accent-foreground" />
              </div>
              <p className="text-sm text-foreground">
                List diamonds and participate in verified marketplace bidding
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                <Lock className="h-4 w-4 text-accent-foreground" />
              </div>
              <p className="text-sm text-foreground">
                Enable escrow-secured payments and protected deal workflows
              </p>
            </div>
          </div>

          <div className="section-divider mb-8" />

          {/* Start button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="btn-premium px-10 py-6 rounded-xl"
              onClick={handleStart}
              disabled={loading}
            >
              Start KYC Verification
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Secure • Confidential • Takes less than 2 minutes
          </p>

          {/* Skip */}
          <div className="flex justify-end mt-4">
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipKyc}
              disabled={loading}
            >
              Skip for now
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default KycStart;
