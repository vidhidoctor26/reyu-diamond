import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "@/hooks/redux";

interface KycRouteProps {
  children: ReactNode;
}

const KycRoute = ({ children }: KycRouteProps) => {
  const { isAuthenticated, kycStatus } = useAppSelector(
    (state) => state.auth
  );

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Still loading compliance
  if (!kycStatus) {
    return null;
  }

  // ✅ If already approved, block KYC pages
  if (kycStatus === "APPROVED") {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
};

export default KycRoute;
