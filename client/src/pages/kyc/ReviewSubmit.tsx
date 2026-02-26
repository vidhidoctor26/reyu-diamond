import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { kycActions } from "@/store/slices/kycSlice";


/* ================= Component ================= */

const ReviewSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { personalDetails, documents, loading } = useAppSelector(
    (state) => state.kyc,
  );
  /* ---------- Redirect if missing data ---------- */
  useEffect(() => {
    if (!personalDetails) {
      navigate("/kyc/personal-details", { replace: true });
      return;
    }

    if (!documents) {
      navigate("/kyc/document-upload", { replace: true });
      return;
    }
  }, [personalDetails, documents, navigate]);

  if (!personalDetails || !documents) return null;

  /* ---------- Mask Aadhaar ---------- */
  const maskAadhaar = (num?: string) => {
    if (!num) return "";
    return num.replace(/\d(?=\d{4})/g, "*");
  };

  const fullName = `${personalDetails.firstName} ${personalDetails.lastName}`;

  /* ---------- Handle navigation after submission ---------- */
  useEffect(() => {
    if (!loading && personalDetails && documents) {
      const sessionSubmitted = sessionStorage.getItem("kycSubmitted");
      if (sessionSubmitted === "true") {
        sessionStorage.removeItem("kycSubmitted");
        navigate("/kyc/status");
      }
    }
  }, [loading, navigate, personalDetails, documents]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-10 rounded-3xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-semibold">Review & Submit</h2>
          </div>

          {/* Personal Info */}
          <div className="border rounded-2xl p-6 space-y-2 text-sm">
            <h3 className="font-semibold text-primary mb-2">
              Personal Information
            </h3>
            <p>
              <strong>Name:</strong> {fullName}
            </p>
            <p>
              <strong>Phone:</strong> {personalDetails.phone}
            </p>
            <p>
              <strong>Country:</strong> {personalDetails.country}
            </p>
            <p>
              <strong>Address:</strong> {personalDetails.address}
            </p>
          </div>

          {/* Identity Info */}
          <div className="border rounded-2xl p-6 space-y-2 text-sm">
            <h3 className="font-semibold text-primary mb-2">
              Identity Details
            </h3>
            <p>
              <strong>Aadhaar:</strong> {maskAadhaar(documents.aadhaarNumber)}
            </p>
            <p>
              <strong>PAN:</strong> {documents.panNumber}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="ghost"
              onClick={() => navigate("/kyc/document-upload")}
            >
              Edit
            </Button>

            <Button
              disabled={loading}
              onClick={() => {
                if (!documents?.aadhaarFile || !documents?.panFile) return;

                sessionStorage.setItem("kycSubmitted", "true");
                dispatch(
                  kycActions.submitKycRequest({
                    aadhaarFile: documents.aadhaarFile,
                    panFile: documents.panFile,
                    selfieFile: documents.selfieFile || null,
                    aadhaarNumber: documents.aadhaarNumber!,
                    panNumber: documents.panNumber!,
                  }),
                );
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReviewSubmit;
