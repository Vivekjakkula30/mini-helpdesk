import { getUserById } from "../admin/users/users.repository.js";
import { assignIssueToAgentData } from "../admin/issues/issues.repository.js";
import {getAgentsData,  getAssignedIssuesData, updateIssueStatusData, setAgentPriorityData, setIssuePriorityByAgentData, assignIssueToAnotherAgentData, getAvailableIssuesData } from "./agents.repository.js";
import { getIssueByIdData } from "../admin/issues/issues.repository.js";
import { validateUpdateIssue, validateAgentPriority, validatePriority } from "../admin/issues/issues.validator.js";
import ThrowError from "../../errors/ThrowError.js";

// List all agents
export const getAgents = async () => {
    return await getAgentsData();
};

// Get issues assigned to an agent
export const getAssignedIssues = async (
    agentId,
    page,
    limit,
    filters = {}
) => {

    // Asking to repository
    const agent = await getUserById(agentId);

    // Check whether user exists
    if (!agent) {
        throw new ThrowError(
            404,
            "AGENT_NOT_FOUND",
            "Agent not found"
        );
    }

    // Check whether the user is actually an agent
    if (agent.role !== "AGENT") {
        throw new ThrowError(
            400,
            "INVALID_ROLE",
            "User is not an agent"
        );
    }

    // Get filtered issues
    return await getAssignedIssuesData(
        agentId,
        page,
        limit,
        filters
    );
};

// Self assigning issues by agents
export const selfAssignIssue = async (issueId, agentId, agentPriority) => {
    try {
        const issue = await getIssueByIdData(issueId);

        if (!issue) {
            throw new ThrowError(
                404,
                "ISSUE_NOT_FOUND",
                "Issue not found"
            );
        }

        const agent = await getUserById(agentId);

        if (!agent) {
            throw new ThrowError(
                404,
                "AGENT_NOT_FOUND",
                "Agent not found"
            );
        }

        if (agent.role !== "AGENT") {
            throw new ThrowError(
                403,
                "INVALID_ROLE",
                "User is not an agent"
            );
        }

        if (issue.assignedId !== null) {
            throw new ThrowError(
                400,
                "ISSUE_ALREADY_ASSIGNED",
                "Issue is already assigned"
            );
        }

        return await assignIssueToAgentData(
            issueId,
            agentId,
            agentId
        );

    } catch (error) {
        throw error;
    }
};


// Change issue status
export const updateIssueStatus = async (
    issueId,
    agentId,
    status
) => {

    try {

        const issue = await getIssueByIdData(
            issueId
        );

        // Check issue exists
        if (!issue) {
            throw new ThrowError(
                404,
                "ISSUE_NOT_FOUND",
                "Issue not found"
            );
        }

        // Check issue is assigned to this agent
        if (issue.assignedId !== agentId) {
            throw new ThrowError(
                403,
                "NOT_ASSIGNED",
                "Issue is not assigned to this agent"
            );
        }

        // Use existing Issue validator
        validateUpdateIssue({
            status: status
            });

        if (
            (issue.status === "OPEN" && status !== "IN_PROGRESS") ||
            (issue.status === "IN_PROGRESS" && status !== "RESOLVED") ||
            (issue.status === "RESOLVED" && status !== "CLOSED")
        ) {
            throw new ThrowError(
                400,
                "INVALID_STATUS_TRANSITION",
                "Invalid status transition"
            );
        }
        return await updateIssueStatusData(
            issueId,
            status
        );

    } catch (error) {
        throw error;
    }
};

export const setAgentPriority = async (
    issueId,
    agentId,
    agentPriority
) => {
    try {
        const issue = await getIssueByIdData(issueId);

        if (!issue) {
            throw new ThrowError(
                404,
                "ISSUE_NOT_FOUND",
                "Issue not found"
            );
        }

        if (issue.assignedId !== agentId) {
            throw new ThrowError(
                403,
                "NOT_ASSIGNED",
                "Issue is not assigned to this agent"
            );
        }

        validateAgentPriority(agentPriority);

        return await setAgentPriorityData(
            issueId,
            agentId,
            agentPriority
        );

    } catch (error) {
        throw error;
    }
};

// For setting actual issue priority by assigned agent
export const setIssuePriorityByAgent = async (
    issueId,
    agentId,
    priority
) => {
    try {
        const issue = await getIssueByIdData(issueId);

        if (!issue) {
            throw new ThrowError(
                404,
                "ISSUE_NOT_FOUND",
                "Issue not found"
            );
        }

        if (issue.assignedId !== agentId) {
            throw new ThrowError(
                403,
                "NOT_ASSIGNED",
                "Issue is not assigned to this agent"
            );
        }

        validatePriority(priority);

        return await setIssuePriorityByAgentData(
            issueId,
            agentId,
            priority
        );

    } catch (error) {
        throw error;
    }
};


// For assigning an issue to another agent
export const assignIssueToAnotherAgent = async (
    issueId,
    agentId,
    assignedId
) => {
    try {
        const issue = await getIssueByIdData(issueId);

        if (!issue) {
            throw new ThrowError(
                404,
                "ISSUE_NOT_FOUND",
                "Issue not found"
            );
        }

        const assigningAgent = await getUserById(agentId);

        if (!assigningAgent) {
            throw new ThrowError(
                404,
                "AGENT_NOT_FOUND",
                "Agent not found"
            );
        }

        if (assigningAgent.role !== "AGENT") {
            throw new ThrowError(
                403,
                "INVALID_ROLE",
                "User is not an agent"
            );
        }

        const targetAgent = await getUserById(assignedId);

        if (!targetAgent) {
            throw new ThrowError(
                404,
                "AGENT_NOT_FOUND",
                "Target agent not found"
            );
        }

        if (targetAgent.role !== "AGENT") {
            throw new ThrowError(
                400,
                "INVALID_ROLE",
                "Issue can only be assigned to an Agent"
            );
        }

        if (assignedId === agentId) {
            throw new ThrowError(
                400,
                "INVALID_ASSIGNMENT",
                "Use self-assign for assigning the issue to yourself"
            );
        }

        return await assignIssueToAnotherAgentData(
            issueId,
            assignedId,
            agentId
        );

    } catch (error) {
        throw error;
    }
};

export const getAvailableIssues = async (page, limit) => {
    return await getAvailableIssuesData(page, limit);
};

export const getAgentIssueById = async (issueId) => {
    const issue = await getIssueByIdData(issueId);

    if (!issue) {
        throw new ThrowError(
            404,
            "ISSUE_NOT_FOUND",
            "Issue not found"
        );
    }

    return issue;
};




