import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {getAgentsController, setAgentPriorityController, setIssuePriorityByAgentController, assignIssueToAnotherAgentController, getAvailableIssuesController, getAgentIssueByIdController} from "./agents.controller.js";
import { getAssignedIssuesController } from "./agents.controller.js";
import { selfAssignIssueController } from "./agents.controller.js";
import {updateIssueStatusController} from "./agents.controller.js";
import { requireAgent } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// List of agents
router.use(authMiddleware);
router.get("/", getAgentsController);
router.get("/available-issues", getAvailableIssuesController);
  // List of agents
router.use(requireAgent);
router.get("/issues/:id", getAgentIssueByIdController);
router.get("/issues", getAssignedIssuesController); // Assigned issues
router.put("/issues/:id/self-assign", selfAssignIssueController); //  self assigned issues
router.put("/issues/:id/status", updateIssueStatusController);  //AGent only status update
router.put("/issues/:id/agent-priority", setAgentPriorityController)
router.put("/issues/:id/priority",setIssuePriorityByAgentController);
router.put("/issues/:id/assign",assignIssueToAnotherAgentController);

export default router;


