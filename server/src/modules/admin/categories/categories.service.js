import {
    getAllCategories,
    addCategory,
    getCategoryById,
    updateCategory,
    softDeleteCategory,
    getCategoryByName
} from "./categories.repository.js";

import ThrowError from "../../../errors/ThrowError.js";

import { isCategoryUsed } from "../issues/issues.repository.js";


// For getting all categories
export const getCategories = async () => {
    try {
        return await getAllCategories();
    } catch (error) {
        throw error;
    }
};


// For creating category
export const createCategory = async (categoryData) => {
    try {
        const existingCategory = await isCategoryNameUsed(
            categoryData.name
        );

        if (existingCategory) {
            throw new ThrowError(
                409,
                "CATEGORY_EXISTS",
                "Category name already exists"
            );
        }

        const category = await addCategory(categoryData);

        return category;

    } catch (error) {
        throw error;
    }
};


// For finding category by id
export const getCategoryByIdService = async (id) => {
    try {
        const category = await getCategoryById(id);

        if (!category) {
            throw new ThrowError(
                404,
                "CATEGORY_NOT_FOUND",
                "Category not found"
            );
        }

        return category;

    } catch (error) {
        throw error;
    }
};


// For updating category
export const updateCategoryById = async (id, categoryData) => {
    try {
        const category = await updateCategory(id, categoryData);

        if (!category) {
            throw new ThrowError(
                404,
                "CATEGORY_NOT_FOUND",
                "Category not found"
            );
        }

        return category;

    } catch (error) {
        throw error;
    }
};


// For soft deleting category
export const deleteCategory = async (id) => {
    try {
        const category = await softDeleteCategory(id);

        if (!category) {
            throw new ThrowError(
                404,
                "CATEGORY_NOT_FOUND",
                "Category not found"
            );
        }

        return category;

    } catch (error) {
        throw error;
    }
};


// For category deleting checking by admin
export const isDeleteCategory = async (id) => {
    try {
        if (await isCategoryUsed(id)) {
            throw new ThrowError(
                400,
                "CATEGORY_IN_USE",
                "Category is already assigned to an issue and cannot be deleted"
            );
        }

        const category = await softDeleteCategory(id);

        if (!category) {
            throw new ThrowError(
                404,
                "CATEGORY_NOT_FOUND",
                "Category not found"
            );
        }

        return category;

    } catch (error) {
        throw error;
    }
};

export const checkCategoryInUse = async (id) => {
    try {
        const isUsed = await isCategoryUsed(id);

        return {
            isUsed
        };
    } catch (error) {
        throw error;
    }
};


// For checking category name
export const isCategoryNameUsed = async (name) => {
    return await getCategoryByName(name);
};