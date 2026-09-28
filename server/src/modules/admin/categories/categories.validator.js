import ThrowError from "../../../errors/ThrowError.js";

export const validateCreateCategory = (categoryData) => {

    if (!categoryData.name) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Category name is required"
        );
    }

    if (typeof categoryData.name !== "string") {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Category name must be a string"
        );
    }
};


// For validating category id
export const validateCategoryId = (id) => {

    if (!Number.isInteger(id) || id <= 0) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Category id must be a valid number"
        );
    }
};


// For updating category
export const validateUpdateCategory = (categoryData) => {

    if (categoryData.name !== undefined &&
        typeof categoryData.name !== "string") {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Category name must be a string"
        );
    }

    if (categoryData.description !== undefined &&
        typeof categoryData.description !== "string") {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Category description must be a string"
        );
    }
};