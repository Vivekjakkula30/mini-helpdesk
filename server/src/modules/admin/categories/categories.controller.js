import {
    getCategories,
    createCategory as createCategoryService,
    getCategoryByIdService,
    updateCategoryById,
    isDeleteCategory,
    checkCategoryInUse
} from "./categories.service.js";

import { validateCreateCategory, validateCategoryId, validateUpdateCategory } from "./categories.validator.js";
import { successResponse } from "../../../helpers/responseHelper.js";

// For getting all categories
export const getCategoriesController = async (req, res, next) => {
    try {
        const categories = await getCategories();

        return successResponse(res, 200, categories);
    } catch (error) {
        next(error);
    }
};


// For creating categories
export const createCategoryController = async (req, res, next) => {
    try {
        const categoryData = req.body;

        validateCreateCategory(categoryData);

        const category = await createCategoryService(categoryData);

        return successResponse(res, 201, category);
    } catch (error) {
        next(error);
    }
};


// For getting category by id
export const getCategoryByIdController = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        validateCategoryId(id);

        const category = await getCategoryByIdService(id);

        return successResponse(res, 200, category);
    } catch (error) {
        next(error);
    }
};


// For updating category by id
export const updateCategoryByController = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const categoryData = req.body;

        validateCategoryId(id);
        validateUpdateCategory(categoryData)

        const category = await updateCategoryById(id, categoryData);

        return successResponse(res, 200, category);
    } catch (error) {
        next(error);
    }
};


// For soft deleting category
export const deleteCategoryController = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        validateCategoryId(id);

        const category = await isDeleteCategory(id);

        return successResponse(res, 200, {
            message: "Category soft deleted successfully",
            category
        });
    } catch (error) {
        next(error);
    }
};

// For checking whether category is in use
export const checkCategoryInUseController = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        validateCategoryId(id);

        const result = await checkCategoryInUse(id);

        return successResponse(res, 200, result);
    } catch (error) {
        next(error);
    }
};