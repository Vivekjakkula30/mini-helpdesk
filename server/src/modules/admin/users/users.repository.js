import db from "../../../config/db.js";

// Get all active users
export const getAllUsers = async (page, limit) => {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `SELECT 
            id, 
            name, 
            email, 
            role
         FROM users
         WHERE isDeleted = false
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    const [countRows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM users
         WHERE isDeleted = false`
    );

    return {
        users: rows,
        total: Number(countRows[0].total)
    };
};


// Get user summary
export const getUserSummary = async () => {
    const [rows] = await db.query(
        `SELECT
            COUNT(*) AS totalUsers,
            SUM(role = 'ADMIN') AS admins,
            SUM(role = 'AGENT') AS agents,
            SUM(role = 'REPORTER') AS reporters
         FROM users
         WHERE isDeleted = false`
    );

    return {
        totalUsers: Number(rows[0].totalUsers),
        admins: Number(rows[0].admins || 0),
        agents: Number(rows[0].agents || 0),
        reporters: Number(rows[0].reporters || 0)
    };
};


// Add new user
export const addUser = async (user) => {
    const { name, email, password, role } = user;

    const [result] = await db.query(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)`,
        [name, email, password, role]
    );

    return getUserById(result.insertId);
};


// Get user by ID
export const getUserById = async (id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            name,
            email,
            role
         FROM users
         WHERE id = ?
         AND isDeleted = false`,
        [id]
    );

    return rows[0] || null;
};


// Update user
export const updateUser = async (id, userData) => {
    const existingUser = await getUserById(id);

    if (!existingUser) {
        return null;
    }

    const email = userData.email ?? existingUser.email;
    const role = userData.role ?? existingUser.role;

    await db.query(
        `UPDATE users
         SET email = ?,
             role = ?
         WHERE id = ?
         AND isDeleted = false`,
        [email, role, id]
    );

    return getUserById(id);
};


// Soft delete user
export const softDeleteUser = async (id) => {
    const [result] = await db.query(
        `UPDATE users
         SET isDeleted = true
         WHERE id = ?
         AND isDeleted = false`,
        [id]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return {
        id,
        isDeleted: true
    };
};


// Get user by email
// Password is required here only for authentication.
export const getUserByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT
            id,
            name,
            email,
            password,
            role
         FROM users
         WHERE email = ?
         AND isDeleted = false`,
        [email]
    );

    return rows[0] || null;
};

export const saveResetToken = async (
    userId,
    resetToken,
    resetTokenExpiry
) => {
    await db.query(
        `UPDATE users
         SET resetToken = ?,
             resetTokenExpiry = ?
         WHERE id = ?
         AND isDeleted = false`,
        [resetToken, resetTokenExpiry, userId]
    );
};


export const getUserByResetToken = async (resetToken) => {
    const [rows] = await db.query(
        `SELECT
            id,
            name,
            email,
            password,
            resetToken,
            resetTokenExpiry
         FROM users
         WHERE resetToken = ?
         AND isDeleted = false`,
        [resetToken]
    );

    return rows[0] || null;
};

export const updatePasswordByResetToken = async (
    resetToken,
    hashedPassword
) => {
    const [result] = await db.query(
        `UPDATE users
         SET password = ?,
             resetToken = NULL,
             resetTokenExpiry = NULL
         WHERE resetToken = ?
         AND isDeleted = false`,
        [hashedPassword, resetToken]
    );

    return result.affectedRows > 0;
};