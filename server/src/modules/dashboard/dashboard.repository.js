import db from "../../config/db.js";


// For admin dashboard kpis
export const getTotalIssues = async () => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS totalIssues
         FROM issues
         WHERE isDeleted = false`
    );

    return rows[0].totalIssues;
};

export const getIssueStatusCounts = async () => {
    const [rows] = await db.query(
        `SELECT
            SUM(status = 'OPEN') AS openIssues,
            SUM(status = 'IN_PROGRESS') AS inProgressIssues,
            SUM(status = 'RESOLVED') AS resolvedIssues,
            SUM(status = 'CLOSED') AS closedIssues
         FROM issues
         WHERE isDeleted = false`
    );

    return rows[0];
};

export const getIssuePriorityCounts = async () => {
    const [rows] = await db.query(
        `SELECT
            SUM(priority = 'HIGH') AS highPriority,
            SUM(priority = 'MEDIUM') AS mediumPriority,
            SUM(priority = 'LOW') AS lowPriority
         FROM issues
         WHERE isDeleted = false`
    );

    return rows[0];
};

export const getUserCounts = async () => {
    const [rows] = await db.query(
        `SELECT
            COUNT(*) AS totalUsers,
            SUM(role = 'ADMIN') AS totalAdmins,
            SUM(role = 'AGENT') AS totalAgents,
            SUM(role = 'REPORTER') AS totalReporters
         FROM users
         WHERE isDeleted = false`
    );

    return rows[0];
};

export const getAssignmentCounts = async () => {
    const [rows] = await db.query(
        `SELECT
            SUM(assignedId IS NOT NULL) AS assignedIssues,
            SUM(assignedId IS NULL) AS unassignedIssues
         FROM issues
         WHERE isDeleted = false`
    );

    return rows[0];
};

// category wise count 
export const getIssuesByCategory = async () => {
    const [rows] = await db.query(
        `SELECT
            categories.id AS categoryId,
            categories.name AS categoryName,
            COUNT(issues.id) AS issueCount
         FROM categories
         LEFT JOIN issues
            ON categories.id = issues.categoryId
            AND issues.isDeleted = false
         WHERE categories.isDeleted = false
         GROUP BY categories.id, categories.name
         ORDER BY issueCount DESC`
    );

    return rows;
};

// Agent wise assigned issue count
export const getIssuesByAgent = async () => {
    const [rows] = await db.query(
        `SELECT
            users.id AS agentId,
            users.name AS agentName,
            COUNT(issues.id) AS issueCount
         FROM users
         LEFT JOIN issues
            ON users.id = issues.assignedId
            AND issues.isDeleted = false
         WHERE users.role = 'AGENT'
         AND users.isDeleted = false
         GROUP BY users.id, users.name
         ORDER BY issueCount DESC`
    );

    return rows;
};

// For agent dashboard kpis

// Agent ka total assigned issues
export const getAgentTotalIssues = async (agentId) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS totalIssues
         FROM issues
         WHERE assignedId = ?
         AND isDeleted = false`,
        [agentId]
    );

    return rows[0].totalIssues;
};

// ye status wise count kitne open, close,etc.

export const getAgentStatusCounts = async (agentId) => {
    const [rows] = await db.query(
        `SELECT
            SUM(status = 'OPEN') AS openIssues,
            SUM(status = 'IN_PROGRESS') AS inProgressIssues,
            SUM(status = 'RESOLVED') AS resolvedIssues,
            SUM(status = 'CLOSED') AS closedIssues
         FROM issues
         WHERE assignedId = ?
         AND isDeleted = false`,
        [agentId]
    );

    return rows[0];
};

// Ye priority wise count hai kitne high, medium etc low hai issues

export const getAgentPriorityCounts = async (agentId) => {
    const [rows] = await db.query(
        `SELECT
            SUM(priority = 'HIGH') AS highPriority,
            SUM(priority = 'MEDIUM') AS mediumPriority,
            SUM(priority = 'LOW') AS lowPriority
         FROM issues
         WHERE assignedId = ?
         AND isDeleted = false`,
        [agentId]
    );

    return rows[0];
};

// agentPriority ke basis par 3 / 2 / 1.
export const getAgentPersonalPriorityCounts = async (agentId) => {
    const [rows] = await db.query(
        `SELECT
            SUM(agentPriority = 3) AS priorityThree,
            SUM(agentPriority = 2) AS priorityTwo,
            SUM(agentPriority = 1) AS priorityOne
         FROM issues
         WHERE assignedId = ?
         AND isDeleted = false`,
        [agentId]
    );

    return rows[0];
};

// For Reporter Dashboard

// get total issues of reporter
export const getReporterTotalIssues = async (reporterId) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS totalIssues
         FROM issues
         WHERE reporterId = ?
         AND isDeleted = false`,
        [reporterId]
    );

    return rows[0].totalIssues;
};

// status wise count kitne progress, open, etc.
export const getReporterStatusCounts = async (reporterId) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(SUM(status = 'OPEN'), 0) AS openIssues,
            COALESCE(SUM(status = 'IN_PROGRESS'), 0) AS inProgressIssues,
            COALESCE(SUM(status = 'RESOLVED'), 0) AS resolvedIssues,
            COALESCE(SUM(status = 'CLOSED'), 0) AS closedIssues
         FROM issues
         WHERE reporterId = ?
         AND isDeleted = false`,
        [reporterId]
    );

    return rows[0];
};

// priority wise high,medium,low kitne hai
export const getReporterPriorityCounts = async (reporterId) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(SUM(priority = 'HIGH'), 0) AS highPriority,
            COALESCE(SUM(priority = 'MEDIUM'), 0) AS mediumPriority,
            COALESCE(SUM(priority = 'LOW'), 0) AS lowPriority
         FROM issues
         WHERE reporterId = ?
         AND isDeleted = false`,
        [reporterId]
    );

    return rows[0];
};