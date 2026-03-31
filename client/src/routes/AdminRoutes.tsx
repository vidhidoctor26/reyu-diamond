import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import AdminShell from "@/components/layout/AdminShell";

const AdminRoutes = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
};

export default AdminRoutes;