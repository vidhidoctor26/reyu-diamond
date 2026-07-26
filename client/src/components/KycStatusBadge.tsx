import { useAppSelector } from "@/hooks/redux";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, XCircle } from "lucide-react";

export const KycStatusBadge = () => {
 const kycStatus = useAppSelector(
  (state: any) => state.auth.kycStatus
);

  if (!kycStatus || kycStatus === "NOT_STARTED") return null;

  if (kycStatus === "APPROVED") {
    return (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        <ShieldCheck className="h-3 w-3 mr-1" />
        KYC Verified
      </Badge>
    );
  }

  if (kycStatus === "PENDING") {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
        <Clock className="h-3 w-3 mr-1" />
        KYC Pending
      </Badge>
    );
  }

  if (kycStatus === "REJECTED") {
    return (
      <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
        <XCircle className="h-3 w-3 mr-1" />
        KYC Rejected
      </Badge>
    );
  }

  return null;
};

