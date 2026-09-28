import {
    getUsers as getUsersFromService,
    getUserSummaryService,
    createUser as createUserService,
    getUserByIdService,
    updateUserById,
    deleteUser as deleteUserFromService
} from "./users.service.js";

import {
    validateCreateUser,
    validateUserId,
    validateUpdateUser
} from "./users.validator.js";

import { successResponse } from "../../../helpers/responseHelper.js";

// Get all users
export const getUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await getUsersFromService(page, limit);

        const totalPages = Math.ceil(result.total / limit);

        return successResponse(res, 200, {
            users: result.users,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user summary
export const getUserSummary = async (req, res, next) => {
    try {
        const summary = await getUserSummaryService();

        return successResponse(res, 200, summary);
    } catch (error) {
        next(error);
    }
};

// Create a new user
export const createUser = async (req, res, next) => {
    try {
        const userData = req.body;

        validateCreateUser(userData);

        const user = await createUserService(userData);

        return successResponse(res, 201, user);
    } catch (error) {
        next(error);
    }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        validateUserId(id);

        const user = await getUserByIdService(id);

        return successResponse(res, 200, user);
    } catch (error) {
        next(error);
    }
};

// Update user email or role
export const updateUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userData = req.body;

        validateUserId(id);
        validateUpdateUser(userData);

        const user = await updateUserById(id, userData);

        return successResponse(res, 200, user);
    } catch (error) {
        next(error);
    }
};

// Soft delete user
export const deleteUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        validateUserId(id);

        const user = await deleteUserFromService(id);

        return successResponse(res, 200, {
            message: "User soft deleted successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};