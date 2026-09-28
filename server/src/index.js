import express from "express";
import cors from "cors";

import userRoutes from "./modules/admin/users/users.route.js";
import categoryRoutes from "./modules/admin/categories/categories.route.js";
import issueRoutes from "./modules/admin/issues/issues.routes.js";
import reporterRoutes from "./modules/reporter/reporter.route.js";
import getAgents from "./modules/agent/agents.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";

const app = express();

// CORS configuration
app.use(cors({ origin: "*" }));

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/reporter", reporterRoutes);
app.use("/api/agents", getAgents);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global error handler
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
