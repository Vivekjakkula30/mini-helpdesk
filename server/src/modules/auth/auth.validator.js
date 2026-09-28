import ThrowError from "../../errors/ThrowError.js";

export const validateRegister = (userData) => {

    const { name, email, password, role } = userData;

    if (!name || !email || !password || !role) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Name, email, password and role are required"
        );
    }

    const validRoles = ["ADMIN", "AGENT", "REPORTER"];

    if (!validRoles.includes(role)) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Invalid role"
        );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Invalid email format"
        );
    }

    if (typeof password !== "string" || password.length < 6) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Password must be at least 6 characters"
        );
    }

    return null;
};

export const validateLogin = (userData) => {

    const { email, password } = userData;

    if (!email || !password) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Email and password are required"
        );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Invalid email format"
        );
    }

    return null;
};

export const validateForgetPassword = (userData) => {

    const { email } = userData;

    if (!email) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Email is required"
        );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        throw new ThrowError(
            400,
            "VALIDATION_ERROR",
            "Invalid email format"
        );
    }

    return null;
};