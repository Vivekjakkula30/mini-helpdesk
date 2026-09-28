import ThrowError from "../../../errors/ThrowError.js";

export const validateCreateUser = (userData) => {
    const { name, email, password, role } = userData;

    const STATUS_CODE = 400;
    const TITLE = "VALIDATION_ERROR";

    if (!name || !email || !password || !role) {
        throw new ThrowError(
            STATUS_CODE,
            TITLE,
            "Name, email, password and role are required"
        );
    }

    const validRoles = ["ADMIN", "AGENT", "REPORTER"];

    if (!validRoles.includes(role)) {
        throw new ThrowError(
            STATUS_CODE,
            TITLE,
            "Invalid Role"
        );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        throw new ThrowError(
            STATUS_CODE,
            TITLE,
            "Invalid email format"
        );
    }

    if (typeof password !== "string" || password.length < 6) {
        throw new ThrowError(
            STATUS_CODE,
            TITLE,
            "Password must be at least 6 characters long"
        );
    }

    return null;
};

export const validateUserId = (id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Invalid user ID"
        );
    }

    return null;
};

export const validateUpdateUser = (userData) => {
    const allowedFields = ["email", "role"];
    const providedFields = Object.keys(userData);

    if (providedFields.length === 0) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "At least one field is required"
        );
    }

    const hasInvalidField = providedFields.some(
        (field) => !allowedFields.includes(field)
    );

    if (hasInvalidField) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Only email and role can be updated by admin"
        );
    }

    if (userData.email !== undefined) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            typeof userData.email !== "string" ||
            !emailPattern.test(userData.email)
        ) {
            throw new ThrowError(
                400,
                "VALIDATION_ERROR",
                "Invalid email format"
            );
        }
    }

    if (userData.role !== undefined) {
        const validRoles = ["ADMIN", "AGENT", "REPORTER"];

        if (!validRoles.includes(userData.role)) {
            throw new ThrowError(
                400,
                "VALIDATION_ERROR",
                "Invalid Role"
            );
        }
    }

    return null;
};