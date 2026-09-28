import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "../context/AuthContext.jsx";
import AppLayout from "./AppLayout.jsx";

const AdminLayout = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default AdminLayout;