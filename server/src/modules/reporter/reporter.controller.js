import { getReporterIssues, getReporterIssuesById } from "./reporter.service.js";
import { reopenIssue, createIssue } from "../admin/issues/issues.service.js";
import {validateIssueId, validateUserId, validateCreateIssue} from "../admin/issues/issues.validator.js";
import { successResponse } from "../../helpers/responseHelper.js";

// For listing 
export const getReporterIssuesController = async (req, res, next) => {

    try {
        const reporterId = Number(req.user.id);

        const page = req.query.page
            ? Number(req.query.page)
            : 1;

        const limit = req.query.limit
            ? Number(req.query.limit)
            : 10;

        const issues = await getReporterIssues(reporterId, page, limit);

        return successResponse(res, 200, issues);
    
    } catch(error){
        next(error);
    }
};

// For reading an issue
export const getReporterIssuesByIdController = async (req, res, next) => {
    try {
        const issueId = Number(req.params.id);
        const reporterId = Number(req.user.id);

        const issue = await getReporterIssuesById(issueId, reporterId);

        return successResponse(res, 200, issue);

    } catch(error){
        next(error);
    }
};

// For reopening the issue
export const reopenIssueController = async (req, res, next) => {
    try {

       
        const issueId = Number(req.params.id);
        const reporterId = Number(req.user.id);
        const reopenReason = req.body?.reopenReason || null;

        validateIssueId(issueId);
        validateUserId(reporterId);

        const issue = await reopenIssue(
            issueId,
            reporterId,
            reopenReason
        );

        return successResponse(res, 200, issue);

    } catch (error) {
        next(error);
    }
};

export const createReporterIssueController = async (req, res, next) => {
    try {
        validateCreateIssue(req.body);

        const issueData = {
            ...req.body, // user ki issue details
            reporterId: req.user.id, // JWT se logged-in reporter ki ID
            status: "OPEN" // new issue automatically OPEN
        };

        const issue = await createIssue(issueData);

        return successResponse(res, 201, issue);

    } catch (error) {
        next(error);
    }
};