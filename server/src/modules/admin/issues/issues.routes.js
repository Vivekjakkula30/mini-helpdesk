// list of issues
// Edit dicussions
// Assigned
// Status
// View issues details

import express from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { requireAdmin } from "../../../middlewares/roleMiddleware.js";
import {getIssuesController, createIssueController,getIssuesByIdController, updateIssueController, assignIssueToAgentController, deleteIssueController, setIssuePriorityController,getReopenedIssuesController} from "./issues.controller.js"
import { updateUser } from "../users/users.repository.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireAdmin);

router.get("/", getIssuesController);
// This router is responsible gor getting all issues.
// The required details come from the query parameters and pagination is used and passed to the controller.
// The page, limit and categoryId is converting it into the numbers froms string
// The filtering is used for status, priority, categoryId 
// Then the validation is used to check whether the page number is greater than 0 or not same for limit.
// Then after validation the controller sends it to the services.
// The services fetch issues from the repository in issues.json and calculated the pagination details.
// The controller sends the issue and pagination data in the response. If anything went wrong the controller will pass the error to global error handler

router.post("/", createIssueController);
//This router is responsible for creating a new issue.
// The required details come from the request body in the controller.
// The issue data is validated before sending it to the service like the name, description, priority, etc.
// The service generates the new issue id and creates the issue.
// The service will send it to the repository and it will store it in issues.json
// The controller sends the created issue in the response 

router.get("/reopened", getReopenedIssuesController);

router.get("/:id", getIssuesByIdController);
// This router is responsible for getting an issue by its id
// The required detail comes from params that is id in the controller
// The id is converted into a number
// The issue id is validated whether is integer or not before sending it to the service
// The service checks whether the issue exists
// If the issue exists its details are returned
// If the issue does not exist, an error is thrown
// The controller sends the issue in the response if error is there the global error handler will throw the error.

router.put("/:id", updateIssueController);
// This router is responsible for updating an issue.
// This issues comes from params and updated details from request body.
// The issue id is converted into a number.
// Then issue id and the updated details are validated after that controller will send it to the service.
// The service updates the issue and if the issue does not exist, an error is thrown
// If not then it will pas to the repository and it will update in issues.json
//The controller sends the updated issue in the reponse.

router.put("/:id/assignAgent", assignIssueToAgentController);
// This router is responsible for assigning an issue to an agent
// The issue id comes from params and assignedId and assignedBy comes from the request body.
// The ids are converted into numbers 
// Then the issueId, assigned agent id and assignedBy id are validated.
// The validated details are sent to the service.
// The service assigns the agent to the issue and if the issue is not exist, an error is thrown
// The controller sends the updated issue in the response

router.delete("/:id", deleteIssueController);
// This router is responsible for deleting an issue
// The issue id comes from params in the controller
// The id is converted into a number
// The issue id is validated before sending it to the service
// The service checks whether the issue exists
// If the issue exists, the issue is deleted
// If the issue does not exist, an error is thrown
// The controller sends a delete message in the response
// {
//   message: "Issue deleted successfully"
// }

router.put("/:id/priority", setIssuePriorityController)  //For this particular issue, update only its priority






export default router;

