import db from "../../config/db.js";


// For listing
export const getReporterIssuesData = async (
    reporterId,
    page,
    limit
) => {

    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `SELECT
            id,
            title,
            description,
            reporterId,
            categoryId,
            status,
            priority,
            assignedId,
            assignedBy,
            createdAt,
            updatedAt
         FROM issues
         WHERE reporterId = ?
         AND isDeleted = false
         ORDER BY createdAt DESC
         LIMIT ? OFFSET ?`,
        [reporterId, limit, offset]
    );

    const [countRows] = await db.query(
        `SELECT COUNT(*) AS totalItems
         FROM issues
         WHERE reporterId = ?
         AND isDeleted = false`,
        [reporterId]
    );

    const totalItems = Number(countRows[0].totalItems);

    const totalPages = Math.ceil(
        totalItems / limit
    );

    return {
        issues: rows,
        totalItems,
        totalPages
    };
};


// For reading
export const getReporterIssuesByIdData = async (
    issueId,
    reporterId
) => {

    const [rows] = await db.query(
        `SELECT
            issues.id,
            issues.title,
            issues.description,
            issues.reporterId,
            issues.categoryId,
            issues.status,
            issues.priority,
            issues.assignedId,
            issues.assignedBy,
            issues.createdAt,
            issues.updatedAt,
            issues.reopened,
            issues.reopenReason,
            issues.reopenedBy,
            issues.reopenedAt,
            agent.name AS assignedAgentName
         FROM issues
         LEFT JOIN users AS agent
            ON issues.assignedId = agent.id
         WHERE issues.id = ?
         AND issues.reporterId = ?
         AND issues.isDeleted = false`,
        [issueId, reporterId]
    );

    return rows[0] || null;
};