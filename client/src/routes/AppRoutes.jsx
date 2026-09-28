import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import AdminLayout from "../layouts/AdminLayout.jsx";
import AgentLayout from "../layouts/AgentLayout.jsx";
import ReporterLayout from "../layouts/ReporterLayout.jsx";

import AdminDashboard from "../pages/AdminDashboard.jsx";
import ReporterDashboard from "../pages/ReporterDashboard.jsx";
import AgentDashboard from "../pages/AgentDashboard.jsx";

import Users from "../pages/Users.jsx";
import AddUser from "../pages/AddUser.jsx";
import UserDetails from "../pages/UserDetails.jsx";
import EditUser from "../pages/EditUser.jsx";

import AgentSummary from "../pages/AgentSummary.jsx";

import Categories from "../pages/Categories.jsx";
import CategoryDetails from "../pages/CategoryDetails.jsx";
import EditCategory from "../pages/EditCategory.jsx";

import Issues from "../pages/Issues.jsx";
import IssueDetails from "../pages/IssueDetails.jsx";

import ReporterIssueDetails from "../pages/ReporterIssueDetails.jsx";
import ReporterCreateIssue from "../pages/ReporterCreateIssue.jsx";

import AgentIssues from "../features/agent/issues/AgentIssues.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Admin Routes */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="users"
          element={<Users />}
        />

        <Route
          path="users/add"
          element={<AddUser />}
        />

        <Route
          path="users/:id"
          element={<UserDetails />}
        />

        <Route
          path="users/:id/edit"
          element={<EditUser />}
        />

        <Route
          path="agents"
          element={<AgentSummary />}
        />

        <Route
          path="categories"
          element={<Categories />}
        />

        <Route
          path="categories/:id"
          element={<CategoryDetails />}
        />

        <Route
          path="categories/:id/edit"
          element={<EditCategory />}
        />

        <Route
          path="issues"
          element={<Issues />}
        />

        <Route
          path="issues/:id"
          element={<IssueDetails />}
        />
      </Route>

      {/* Agent Routes */}

      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={["AGENT"]}>
            <AgentLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={<AgentDashboard />}
        />

        <Route
          path="issues"
          element={<AgentIssues />}
        />

        <Route
          path="issues/:id"
          element={<IssueDetails />}
        />
        
      </Route>

      {/* Reporter Routes */}

      <Route
        path="/reporter"
        element={
          <ProtectedRoute allowedRoles={["REPORTER"]}>
            <ReporterLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={<ReporterDashboard />}
        />

        <Route
          path="issues/create"
          element={<ReporterCreateIssue />}
        />

        <Route
          path="issues/:id"
          element={<ReporterIssueDetails />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;