import db from "../../../config/db.js";

export const getIssuesData = async (
    page,
    limit,
    status,
    priority,
    categoryId
) => {

    let query = `
        SELECT
            issues.id,
            issues.title,
            issues.reporterId,
            issues.categoryId,
            issues.status,
            issues.priority,
            issues.assignedId,
            reporter.name AS reporterName,
            agent.name AS assignedAgentName
        FROM issues
        LEFT JOIN users AS reporter
            ON issues.reporterId = reporter.id
        LEFT JOIN users AS agent
            ON issues.assignedId = agent.id
        WHERE issues.isDeleted = false
        `;

    // dynamic query mein conditions easily add karne ke liye use kiya hai

    const values = [];

    // SQL injection ka risk avoid karne ke liye
    // query placeholders (?) use kiye hain.

    if (status) {
        query += ` AND issues.status = ?`;
        values.push(status);
    }

    if (priority) {
        query += ` AND issues.priority = ?`;
        values.push(priority);
    }

    if (categoryId) {
        query += ` AND issues.categoryId = ?`;
        values.push(categoryId);
    }

    query += ` ORDER BY issues.createdAt DESC`;

    const offset = (page - 1) * limit;

    query += ` LIMIT ? OFFSET ?`;

    values.push(limit, offset);

    const [rows] = await db.query(query, values);

    // Total issues kitne hai count rakhne ke liye
    let countQuery = `
        SELECT COUNT(*) AS totalItems
        FROM issues
        WHERE 1 = 1
        AND isDeleted = false
        `;

    const countValues = [];

    if (status) {
        countQuery += ` AND status = ?`;
        countValues.push(status);
    }

    if (priority) {
        countQuery += ` AND priority = ?`;
        countValues.push(priority);
    }

    if (categoryId) {
        countQuery += ` AND categoryId = ?`;
        countValues.push(categoryId);
    }

    const [countRows] = await db.query(
        countQuery,
        countValues
    );

    const totalItems = countRows[0].totalItems;

    return {
        issues: rows,
        totalItems
    };
};


// For creating an issue
export const createIssueData = async (issue) => {

    const {
        title,
        description,
        reporterId,
        categoryId,
        status,
        priority,
        assignedId,
        assignedBy
    } = issue;

    const [result] = await db.query(
        `INSERT INTO issues
        (
            title,
            description,
            reporterId,
            categoryId,
            status,
            priority,
            assignedId,
            assignedBy
        )
        values (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title,
            description,
            reporterId,
            categoryId,
            status,
            priority,
            assignedId,
            assignedBy
        ]
    );

    return getIssueByIdData(result.insertId);
};


// For viewing the issue by id
export const getIssueByIdData = async (issueId) => {

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
            issues.assignedId,
            issues.assignedBy,
            issues.createdAt,
            issues.updatedAt,
            issues.reopened,
            issues.reopenReason,
            issues.reopenedBy,
            issues.reopenedAt,
            reporter.name AS reporterName,
            assignedAgent.name AS assignedAgentName,
            assignedByUser.name AS assignedByName,
            reopenedByUser.name AS reopenedByName
        FROM issues
        LEFT JOIN users AS reporter
            ON issues.reporterId = reporter.id
        LEFT JOIN users AS assignedAgent
            ON issues.assignedId = assignedAgent.id
        LEFT JOIN users AS assignedByUser
            ON issues.assignedBy = assignedByUser.id
        LEFT JOIN users AS reopenedByUser
            ON issues.reopenedBy = reopenedByUser.id
        WHERE issues.id = ?
        AND issues.isDeleted = false
        `,
        [issueId]
    );

    return rows[0] || null;
};


// For updating an issue
export const updateIssueData = async (issueId, issueData) => {

    const { status, discussion } = issueData;

    if (discussion) {
        await db.query(
            `INSERT INTO issue_discussions
            (issueId, agentId, adminId, message)
            VALUES (?, ?, ?, ?)`,
            [
                issueId,
                discussion.agentId || null,
                discussion.adminId || null,
                discussion.message
            ]
        );
    }

    if (status) {

        await db.query(
            `UPDATE issues
            SET status = ?,
                updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [status, issueId]
        );
    }

    return getIssueByIdData(issueId);
};


// For assigning an agent
export const assignIssueToAgentData = async (
    issueId,
    assignedId,
    assignedBy
) => {

    const [result] = await db.query(
        `UPDATE issues
        SET assignedId = ?,
            assignedBy = ?,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [assignedId, assignedBy, issueId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getIssueByIdData(issueId);
};


// For deleting an issue
export const deleteIssueData = async (issueId) => {

    const [result] = await db.query(
        `UPDATE issues
         SET isDeleted = true,
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?
         AND isDeleted = false`,
        [issueId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return {
        id: issueId,
        isDeleted: true
    };
};


// For deleting a category by admin
export const isCategoryUsed = async (categoryId) => {

    const [rows] = await db.query(
        `SELECT id
         FROM issues
         WHERE categoryId = ?
         LIMIT 1`,
        [categoryId]
    );

    return rows.length > 0;
};


// For setting priority
export const setIssuePriorityData = async (
    issueId,
    priority
) => {

    const [result] = await db.query(
        `UPDATE issues
         SET priority = ?,
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [priority, issueId]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getIssueByIdData(issueId);
};


// For reopening issue
export const reopenIssueData = async (
    issueId,
    reporterId,
    reopenReason
) => {

    const [result] = await db.query(
        `UPDATE issues
         SET status = 'OPEN',
             reopened = true,
             reopenReason = ?,
             reopenedBy = ?,
             reopenedAt = CURRENT_TIMESTAMP,
             updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
            reopenReason,
            reporterId,
            issueId
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return getIssueByIdData(issueId);
};


export const getReopenedIssuesData = async () => {

    const [rows] = await db.query(
        `
        SELECT
            issues.id,
            issues.title,
            issues.reporterId,
            issues.categoryId,
            issues.status,
            issues.priority,
            issues.assignedId,
            issues.reopenedAt,
            reporter.name AS reporterName,
            assignedAgent.name AS assignedAgentName
        FROM issues
        LEFT JOIN users AS reporter
            ON issues.reporterId = reporter.id
        LEFT JOIN users AS assignedAgent
            ON issues.assignedId = assignedAgent.id
        WHERE issues.reopened = true
        AND issues.isDeleted = false
        ORDER BY issues.reopenedAt DESC
        `
    );

    return rows;
};