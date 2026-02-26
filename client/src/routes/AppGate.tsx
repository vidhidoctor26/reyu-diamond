import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import type { ReactNode } from "react";

interface AppGateProps {
  children: ReactNode;
}

const AppGate = ({ children }: AppGateProps) => {
  const { isAuthenticated, kycStatus, accountStatus } = useAppSelector(
    (state) => state.auth,
  );

  console.log("AUTH STATE:", {
    isAuthenticated,
    kycStatus,
    accountStatus,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (accountStatus === "SUSPENDED") {
    return <Navigate to="/account-suspended" replace />;
  }

  if (!kycStatus) {
    return null;
  }

  if (kycStatus === "NOT_STARTED") {
    return <Navigate to="/kyc/start" replace />;
  }

  if (kycStatus === "REJECTED") {
    return <Navigate to="/kyc/status" replace />;
  }
  if (kycStatus === "PENDING") {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default AppGate;
