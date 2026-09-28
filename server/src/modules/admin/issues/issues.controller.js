import {
    getIssues,
    createIssue as createIssueService,
    getIssueById,
    updateIssue,
    assignIssueToAgent,
    deleteIssue,
    setIssuePriority,
    getReopenedIssues
    
} from "./issues.service.js";

import {
    validateCreateIssue,
    validatorPagination,
    validateIssueId,
    validateAdminId,
    validateAgentId,
    validateUpdateIssue,
    validateSetPriority,
    validatePriority
} from "./issues.validator.js";

import { successResponse } from "../../../helpers/responseHelper.js";


// For getting issues
export const getIssuesController = async (req, res, next) => {
    try {
        const page = req.query.page
            ? Number(req.query.page)
            : 1;

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 10;

        const status = req.query.status;
        const priority = req.query.priority;

        if (priority) {
            validatePriority(priority);
        }

        const categoryId = req.query.categoryId
            ? Number(req.query.categoryId)
            : undefined;

        validatorPagination(page, limit);

        const issues = await getIssues(
            page,
            limit,
            status,
            priority,
            categoryId
        );

        return successResponse(res, 200, issues);

    } catch (error) {
        next(error);
    }
};


// For creating an issue
export const createIssueController = async (req, res, next) => {
    try {
        const issueData = req.body;

        validateCreateIssue(issueData);

        const issue = await createIssueService(issueData);

        return successResponse(res, 201, issue);

    } catch (error) {
        next(error);
    }
};


// For viewing issue by ID
export const getIssuesByIdController = async (req, res, next) => {
    try {
        const issueId = Number(req.params.id);

        validateIssueId(issueId);

        const issue = await getIssueById(issueId);

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};


// For updating an issue
export const updateIssueController = async (req, res, next) => {
    try {
        const issueId = Number(req.params.id);

        validateIssueId(issueId);

        const {
            agentId,
            adminId,
            ...issueData
        } = req.body;

        validateUpdateIssue(issueData);

        const issue = await updateIssue(
            issueId,
            agentId,
            adminId,
            issueData
        );

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};


// For assigning an agent
export const assignIssueToAgentController = async (
    req,
    res,
    next
) => {
    try {
        const issueId = Number(req.params.id);

        const assignedId = Number(req.body.assignedId);
        const assignedBy = Number(req.user.id);

        validateIssueId(issueId);
        validateAgentId(assignedId);
        validateAdminId(assignedBy);

        const issue = await assignIssueToAgent(
            issueId,
            assignedId,
            assignedBy
        );

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};


// For deleting an issue
export const deleteIssueController = async (
    req,
    res,
    next
) => {
    try {
        const issueId = Number(req.params.id);

        validateIssueId(issueId);

        const issue = await deleteIssue(issueId);

        return successResponse(res, 200, {
            message: "Issue deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};


// For setting priority by admin
export const setIssuePriorityController = async (
    req,
    res,
    next
) => {
    try {
        const issueId = Number(req.params.id);
        const adminId = Number(req.user.id);

        const priorityData = {
            priority: req.body.priority
        };

        validateIssueId(issueId);
        validateAdminId(adminId);
        validateSetPriority(priorityData);

        const issue = await setIssuePriority(
            issueId,
            adminId,
            priorityData.priority
        );

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};

export const getReopenedIssuesController = async (req, res, next) => {
  try {
    const issues = await getReopenedIssues();

    return successResponse(res, 200, issues);
  } catch (error) {
    next(error);
  }
};