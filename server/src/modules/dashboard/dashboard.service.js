import {
    getTotalIssues,
    getIssueStatusCounts,
    getIssuePriorityCounts,
    getUserCounts,
    getAssignmentCounts,
    getIssuesByCategory,
    getIssuesByAgent,
    getAgentTotalIssues,
    getAgentStatusCounts,
    getAgentPriorityCounts,
    getAgentPersonalPriorityCounts,
    getReporterTotalIssues,
    getReporterStatusCounts,
    getReporterPriorityCounts
} from "./dashboard.repository.js";

import ThrowError from "../../errors/ThrowError.js";

export const getDashboard = async (userId, role) => {

    if (role === "ADMIN") {

        return {
            users: await getUserCounts(),
            issues: await getTotalIssues(),
            status: await getIssueStatusCounts(),
            priority: await getIssuePriorityCounts(),
            assignment: await getAssignmentCounts(),
            issuesByCategory: await getIssuesByCategory(),
            issuesByAgent: await getIssuesByAgent()
        };
    }

    if (role === "AGENT") {

        return {
            totalIssues: await getAgentTotalIssues(userId),
            status: await getAgentStatusCounts(userId),
            priority: await getAgentPriorityCounts(userId),
            agentPriority: await getAgentPersonalPriorityCounts(userId)
        };
    }

    if (role === "REPORTER") {

        return {
            totalIssues: await getReporterTotalIssues(userId),
            status: await getReporterStatusCounts(userId),
            priority: await getReporterPriorityCounts(userId)
        };
    }

    throw new ThrowError(
        403,
        "INVALID_ROLE",
        "Invalid user role"
    );
};