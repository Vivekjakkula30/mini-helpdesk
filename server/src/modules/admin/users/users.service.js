import bcrypt from "bcrypt";

import {
    getAllUsers,
    getUserSummary,
    addUser,
    getUserById,
    updateUser,
    softDeleteUser,
    getUserByEmail
} from "./users.repository.js";

import ThrowError from "../../../errors/ThrowError.js";

// Get all active users
export const getUsers = async (page= 1, limit = 10) => {
    try {
        return await getAllUsers(page, limit);
    } catch (error) {
        throw error;
    }
};

// Check whether an email is already used
export const isEmailAlreadyUsed = async (email) => {
    try {
        const user = await getUserByEmail(email);
        return Boolean(user);
    } catch (error) {
        throw error;
    }
};

// For kpis cards 
export const getUserSummaryService = async () => {
    return await getUserSummary();
};

// Create a new user
export const createUser = async (userData) => {
    try {
        const existingUser = await getUserByEmail(userData.email);

        if (existingUser) {
            throw new ThrowError(
                409,
                "EMAIL_EXISTS",
                "Email already exists"
            );
        }

        const hashedPassword = await bcrypt.hash(
            userData.password,
            10
        );

        const user = await addUser({
            ...userData,
            password: hashedPassword
        });

        return user;
    } catch (error) {
        throw error;
    }
};

// Get user by ID
export const getUserByIdService = async (id) => {
    try {
        const user = await getUserById(id);

        if (!user) {
            throw new ThrowError(
                404,
                "USER_NOT_FOUND",
                "User not found"
            );
        }

        return user;
    } catch (error) {
        throw error;
    }
};

// Update user email or role
export const updateUserById = async (id, userData) => {
    try {
        const existingUser = await getUserById(id);

        if (!existingUser) {
            throw new ThrowError(
                404,
                "USER_NOT_FOUND",
                "User not found"
            );
        }

        // Check duplicate email only when the email is changed
        if (
            userData.email !== undefined &&
            userData.email !== existingUser.email
        ) {
            const emailUser = await getUserByEmail(userData.email);

            if (emailUser && emailUser.id !== id) {
                throw new ThrowError(
                    409,
                    "EMAIL_EXISTS",
                    "Email already exists"
                );
            }
        }

        return await updateUser(id, userData);
    } catch (error) {
        throw error;
    }
};

// Soft delete user
export const deleteUser = async (id) => {
    try {
        const user = await softDeleteUser(id);

        if (!user) {
            throw new ThrowError(
                404,
                "USER_NOT_FOUND",
                "User not found"
            );
        }

        return user;
    } catch (error) {
        throw error;
    }
};