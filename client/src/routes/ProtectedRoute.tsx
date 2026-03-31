import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "@/hooks/redux";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, accountStatus } = useAppSelector(
    (state) => state.auth
  );

  if (loading) return null;

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚨 MAIN FIX (ADD THIS)
  if (accountStatus === "SUSPENDED" || accountStatus === "REJECTED") {
    return <Navigate to="/blocked" replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;