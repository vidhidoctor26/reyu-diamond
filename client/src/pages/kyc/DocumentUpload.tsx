import { useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Camera,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { kycActions } from "@/store/slices/kycSlice";

const DocumentUpload = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.kyc);

  const [fileError, setFileError] = useState<string | null>(null);

  const [files, setFiles] = useState({
    aadhaar: null as File | null,
    pan: null as File | null,
    selfie: null as File | null,
  });

  const [docNumbers, setDocNumbers] = useState({
    aadhaar: "",
    pan: "",
  });

  // /* Redirect if personal details missing */
  // useEffect(() => {
  //   if (!personalDetails) {
  //     navigate("/kyc/personal-details", { replace: true });
  //   }
  // }, [personalDetails, navigate]);

  // if (!personalDetails) return null;

  /* File Handler */
  const handleFileChange = (
    key: "aadhaar" | "pan" | "selfie",
    file: File | null,
  ) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, PNG or PDF files are allowed");
      return;
    }

    setFileError(null);
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  /* Number Handler */
  const handleDocNumberChange = (key: "aadhaar" | "pan", value: string) => {
    if (key === "aadhaar") {
      setDocNumbers((prev) => ({
        ...prev,
        aadhaar: value.replace(/\D/g, "").slice(0, 12),
      }));
    } else {
      setDocNumbers((prev) => ({
        ...prev,
        pan: value
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .slice(0, 10),
      }));
    }
  };

  const isAadhaarValid = docNumbers.aadhaar.length === 12;
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(docNumbers.pan);

  const canContinue =
    !!files.aadhaar && !!files.pan && isAadhaarValid && isPanValid;

  // const handleSubmit = () => {
  //   if (!canContinue) return;

  //   dispatch(
  //     kycActions.submitKycRequest({
  //       aadhaarFile: files.aadhaar!,
  //       panFile: files.pan!,
  //       selfieFile: files.selfie,
  //       aadhaarNumber: docNumbers.aadhaar,
  //       panNumber: docNumbers.pan,
  //     }),
  //   );
  // };

  const handleSubmit = () => {
    if (!canContinue) return;

    dispatch(
      kycActions.setDocuments({
        aadhaarFile: files.aadhaar!,
        panFile: files.pan!,
        selfieFile: files.selfie,
        aadhaarNumber: docNumbers.aadhaar,
        panNumber: docNumbers.pan,
      }),
    );

    navigate("/kyc/review-submit");
  };

  /* Redirect After Success */

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6
    bg-[radial-gradient(ellipse_at_top,_hsl(var(--accent)/0.38),_transparent_65%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-3xl shadow-xl border p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <ShieldCheck className="mx-auto h-8 w-8 text-champagne" />
            <h1 className="text-2xl font-semibold">Verification Documents</h1>
            <p className="text-sm text-muted-foreground">
              Upload clear copies of required documents.
            </p>
          </div>

          {/* Aadhaar + PAN */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Aadhaar */}
            <div className="space-y-3">
              <UploadBox
                title="Aadhaar Card"
                desc="Front side"
                icon={<FileText />}
                file={files.aadhaar}
                onFileChange={(f) => handleFileChange("aadhaar", f)}
              />
              <div>
                <Label>Aadhaar Number *</Label>
                <Input
                  value={docNumbers.aadhaar}
                  placeholder="Enter Aadhaar Number"
                  onChange={(e) =>
                    handleDocNumberChange("aadhaar", e.target.value)
                  }
                />
              </div>
            </div>

            {/* PAN */}
            <div className="space-y-3">
              <UploadBox
                title="PAN Card"
                desc="Clear copy"
                icon={<FileText />}
                file={files.pan}
                onFileChange={(f) => handleFileChange("pan", f)}
              />
              <div>
                <Label>PAN Number *</Label>
                <Input
                  value={docNumbers.pan}
                  placeholder="Enter PAN Number"
                  onChange={(e) => handleDocNumberChange("pan", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Selfie */}
          <UploadBox
            title="Selfie Verification"
            desc="Take a live selfie"
            icon={<Camera />}
            file={files.selfie}
            onFileChange={(f) => handleFileChange("selfie", f)}
            optional
          />

          {/* Error */}
          {fileError && <p className="text-sm text-red-500">{fileError}</p>}

          {/* Footer */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button disabled={!canContinue || loading} onClick={handleSubmit}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

/* Upload Box */

const UploadBox = ({
  title,
  desc,
  icon,
  file,
  onFileChange,
  optional,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  file: File | null;
  onFileChange: (file: File | null) => void;
  optional?: boolean;
}) => {
  const isActive = !!file;

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition",
        isActive
          ? "border-emerald-500 bg-emerald-50"
          : "hover:border-champagne",
      )}
    >
      <input
        type="file"
        accept="image/*,.pdf"
        hidden
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />

      <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-muted">
        {isActive ? <CheckCircle2 /> : icon}
      </div>

      <div>
        <p className="font-medium">
          {title} {optional && "(Optional)"}
        </p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>

      {!isActive && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UploadCloud className="h-4 w-4" />
          Click to upload
        </div>
      )}
    </label>
  );
};

export default DocumentUpload;
