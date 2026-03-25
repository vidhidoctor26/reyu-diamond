import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "@/hooks/redux";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) return null;

  if (isAuthenticated) {
    // 🔥 Do NOT decide destination here
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
