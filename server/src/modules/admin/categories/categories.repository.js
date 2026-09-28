import db from "../../../config/db.js";

// Get all active categories
export const getAllCategories = async () => {
    const [rows] = await db.query(
        `SELECT
            id,
            name
         FROM categories
         WHERE isDeleted = false`
    );

    return rows;
};


// Add new category
export const addCategory = async (category) => {
    const { name, description } = category;

    const [result] = await db.query(
        `INSERT INTO categories (name, description)
         VALUES (?, ?)`,
        [name, description]
    );

    return getCategoryById(result.insertId);
};


// Get category by ID
export const getCategoryById = async (id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            name,
            description
         FROM categories
         WHERE id = ?
         AND isDeleted = false`,
        [id]
    );

    return rows[0] || null;
};


// Update category
export const updateCategory = async (id, categoryData) => {

    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
        return null;
    }

    const name = categoryData.name ?? existingCategory.name;

    const description =
        categoryData.description ?? existingCategory.description;

    await db.query(
        `UPDATE categories
         SET name = ?,
             description = ?
         WHERE id = ?
         AND isDeleted = false`,
        [name, description, id]
    );

    return await getCategoryById(id);
};


// Soft delete category
export const softDeleteCategory = async (id) => {

    const [result] = await db.query(
        `UPDATE categories
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


// Get category by name
export const getCategoryByName = async (name) => {

    const [rows] = await db.query(
        `SELECT
            id,
            name,
            description
         FROM categories
         WHERE LOWER(name) = LOWER(?)
         AND isDeleted = false`,
        [name]
    );

    return rows[0] || null;
};