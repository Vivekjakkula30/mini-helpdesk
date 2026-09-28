// List of issues
// Create issues

import express from "express";

import { createReporterIssueController } from "./reporter.controller.js";

import {
  getReporterIssuesController,
  getReporterIssuesByIdController,
  reopenIssueController,
} from "./reporter.controller.js";

import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { requireReporter } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(requireReporter);

// Create issue
router.post("/issues", createReporterIssueController);

// Get reporter issues
router.get("/issues", getReporterIssuesController);

// Get reporter issue by ID
router.get("/issues/:id", getReporterIssuesByIdController);

// Reopen issue
router.put("/issues/:id/reopen", reopenIssueController);

export default router;
