import {getAgents, getAssignedIssues, selfAssignIssue,updateIssueStatus, setAgentPriority, setIssuePriorityByAgent, assignIssueToAnotherAgent, getAvailableIssues, getAgentIssueById} from "./agents.service.js";
import { successResponse } from "../../helpers/responseHelper.js";

export const getAgentsController = async (req, res, next) => {
    try{
        const agents = await getAgents();

        return successResponse(res, 200, agents);
    } catch (error){
        next(error);
    }
};

// For getting agent issues
export const getAssignedIssuesController = async (req, res, next) => {
    try {

        const agentId = Number(req.user.id);

        const page = req.query.page
            ? Number(req.query.page)
            : 1;

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 10;

        const filters = {
            assignment: req.query.assignment || "assigned",
            search: req.query.search || "",
            status: req.query.status || "",
            priority: req.query.priority || "",
            categoryId: req.query.categoryId || ""
        };

        const issues = await getAssignedIssues(
            agentId,
            page,
            limit,
            filters
        );

        return successResponse(
            res,
            200,
            issues
        );

    } catch (error) {
        next(error);
    }
};
// For self-assign the issue
export const selfAssignIssueController = async (req, res, next) => {
    try {
        const issueId = Number(req.params.id);
        const agentId = Number(req.user.id);


        // For service
        const issue = await selfAssignIssue(issueId, agentId);

        return successResponse(res, 200, issue);
    } catch (error) {
        next(error);
    }
};


export const updateIssueStatusController = async (req, res, next
) => {

    try {

        const issueId = Number(
            req.params.id
        );

        const agentId = Number(
            req.user.id
        );

        const status = req.body.status;

        const issue = await updateIssueStatus(
            issueId,
            agentId,
            status
        );

        return successResponse( res,200, issue);

    } catch (error) {

        next(error);

    }
};

export const setAgentPriorityController = async (req, res, next) => {
    try {
        const issueId = Number(req.params.id); // URL se
        const agentId = Number(req.user.id); // JWT se
        const agentPriority = Number(req.body.agentPriority); // body se 1/2/3

        const issue = await setAgentPriority(
            issueId,
            agentId,
            agentPriority
        );

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};

// For setting actual issue priority by assigned agent
export const setIssuePriorityByAgentController = async (req,res,next) => {
    try {
        const issueId = Number(req.params.id);
        const agentId = Number(req.user.id);
        const priority = req.body.priority;

        const issue = await setIssuePriorityByAgent(
            issueId,
            agentId,
            priority
        );

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};

// For assigning an issue to another agent
export const assignIssueToAnotherAgentController = async ( req,res,next) => {
    try {
        const issueId = Number(req.params.id);
        const agentId = Number(req.user.id);
        const assignedId = Number(req.body.agentId);

        const issue = await assignIssueToAnotherAgent(
            issueId,
            agentId,
            assignedId
        );

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};

export const getAvailableIssuesController = async (req, res, next) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        const issues = await getAvailableIssues(page, limit);

        return successResponse(res, 200, issues);
    } catch (error) {
        next(error);
    }
};


export const getAgentIssueByIdController = async (req, res, next) => {
    try {
        const issueId = Number(req.params.id);

        const issue = await getAgentIssueById(issueId);

        return successResponse(res, 200, issue);
    } catch (error) {
        next(error);
    }
};

