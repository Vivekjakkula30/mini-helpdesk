import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "../context/AuthContext.jsx";
import AppLayout from "./AppLayout.jsx";

const ReporterLayout = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "REPORTER") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ReporterLayout;