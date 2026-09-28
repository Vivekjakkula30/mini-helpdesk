import db from "../../config/db.js";
import { getIssueByIdData } from "../admin/issues/issues.repository.js";

export const getAgentsData = async () => {
    const [rows] = await db.query(
        `SELECT
            id,
            name,
            email,
            role
         FROM users
         WHERE role = ?
         AND isDeleted = false`,
        ["AGENT"]
    );

    return rows;
};

export const getAssignedIssuesData = async (
    agentId,
    page,
    limit,
    filters = {}
) => {

    const {
        assignment = "assigned",
        search = "",
        status = "",
        priority = "",
        categoryId = ""
    } = filters;

    const offset = (page - 1) * limit;

    let whereConditions = `
        issues.isDeleted = false
    `;

    const queryParams = [];

    // Assignment filter
    if (assignment === "assigned") {

        whereConditions += `
            AND issues.assignedId = ?
        `;

        queryParams.push(agentId);

    } else if (assignment === "available") {

        whereConditions += `
            AND issues.assignedId IS NULL
        `;

    } else if (assignment === "all") {

        // No assignment condition.
        // Returns both assigned and available issues.

    }

    // Search filter
    if (search.trim()) {

        whereConditions += `
            AND (
                issues.title LIKE ?
                OR issues.description LIKE ?
            )
        `;

        const searchValue = `%${search.trim()}%`;

        queryParams.push(
            searchValue,
            searchValue
        );
    }

    // Status filter
    if (status) {

        whereConditions += `
            AND issues.status = ?
        `;

        queryParams.push(status);
    }

    // Actual issue priority filter
    if (priority) {

        whereConditions += `
            AND issues.priority = ?
        `;

        queryParams.push(priority);
    }

    // Category filter
    if (categoryId) {

        whereConditions += `
            AND issues.categoryId = ?
        `;

        queryParams.push(categoryId);
    }

    // Get filtered issues
    const [rows] = await db.query(
        `
        SELECT
            issues.id,
            issues.title,
            issues.description,
            issues.reporterId,
            issues.categoryId,
            issues.status,
            issues.priority,
            issues.agentPriority,
            issues.assignedId,
            issues.assignedBy,
            issues.createdAt,
            issues.updatedAt
        FROM issues
        WHERE ${whereConditions}
        ORDER BY agentPriority DESC, createdAt DESC
        LIMIT ? OFFSET ?
        `,
        [
            ...queryParams,
            limit,
            offset
        ]
    );

    // Count filtered issues
    const [countRows] = await db.query(
        `
        SELECT COUNT(*) AS totalItems
        FROM issues
        WHERE ${whereConditions}
        `,
        queryParams
    );

    const totalItems = Number(
        countRows[0].totalItems
    );

    const totalPages = Math.ceil(
        totalItems / limit
    );

    return {
        issues: rows,
        totalItems,
        totalPages,
        currentPage: page,
        limit
    };
};


export const updateIssueStatusData = async (issueId, status) => {

    const [result] = await db.query(
        `UPDATE issues
         SET status = ?,
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?
         AND isDeleted = false`,
        [status, issueId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getIssueByIdData(issueId);
};


export const setAgentPriorityData = async (
    issueId,
    agentId,
    agentPriority
) => {

    const [result] = await db.query(
        `UPDATE issues
         SET agentPriority = ?,
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?
         AND assignedId = ?
         AND isDeleted = false`,
        [agentPriority, issueId, agentId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getIssueByIdData(issueId);
};


// For setting actual issue priority by assigned agent
export const setIssuePriorityByAgentData = async (
    issueId,
    agentId,
    priority
) => {

    const [result] = await db.query(
        `UPDATE issues
         SET priority = ?,
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?
         AND assignedId = ?
         AND isDeleted = false`,
        [priority, issueId, agentId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getIssueByIdData(issueId);
};


// For assigning an issue to another agent
export const assignIssueToAnotherAgentData = async (
    issueId,
    assignedId,
    assignedBy
) => {

    const [result] = await db.query(
        `UPDATE issues
         SET assignedId = ?,
             assignedBy = ?,
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?
         AND isDeleted = false`,
        [assignedId, assignedBy, issueId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getIssueByIdData(issueId);
};


export const getAvailableIssuesData = async (page, limit) => {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT
            issues.id,
            issues.title,
            issues.description,
            issues.reporterId,
            issues.categoryId,
            issues.status,
            issues.priority,
            issues.agentPriority,
            issues.assignedId,
            issues.assignedBy,
            issues.createdAt,
            issues.updatedAt,
            reporter.name AS reporterName
        FROM issues
        LEFT JOIN users AS reporter
            ON issues.reporterId = reporter.id
        WHERE issues.assignedId IS NULL
        AND issues.isDeleted = false
        ORDER BY issues.createdAt DESC
        LIMIT ? OFFSET ?
        `,
        [limit, offset]
    );

    const [countRows] = await db.query(
        `
        SELECT COUNT(*) AS totalItems
        FROM issues
        WHERE assignedId IS NULL
        AND isDeleted = false
        `
    );

    const totalItems = countRows[0].totalItems;

    return {
        issues: rows,
        totalItems
    };
};