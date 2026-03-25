import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "@/hooks/redux";

// Routes accessible without KYC approval
const KYC_FREE_PATHS = ["/user/marketplace"];

interface AppGateProps {
  children: ReactNode;
}

const AppGate = ({ children }: AppGateProps) => {
  const { isAuthenticated, kycStatus, accountStatus } = useAppSelector(
    (state) => state.auth
  );
  const { pathname } = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (accountStatus === "SUSPENDED") {
    return <Navigate to="/account-suspended" replace />;
  }

  if (!kycStatus) return null;

  // ✅ Allow marketplace & detail pages through regardless of KYC
  const isKycFree = KYC_FREE_PATHS.some((p) => pathname.startsWith(p));

  if (!isKycFree) {
    if (kycStatus === "NOT_STARTED") {
      // 🛑 Removed forced redirect to allow dashboard access without jumping to KYC
      // return <Navigate to="/kyc/start" replace />;
    }

    if (kycStatus === "REJECTED") {
      return <Navigate to="/kyc/status" replace />;
    }
  }

  return <>{children}</>;
};

export default AppGate;