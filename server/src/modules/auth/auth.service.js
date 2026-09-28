import bcrypt from "bcrypt";
import crypto from "crypto";
import {
    getUserByEmail,
    addUser,
    saveResetToken
} from "../admin/users/users.repository.js";
import ThrowError from "../../errors/ThrowError.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../../services/mail.service.js";


export const generateToken = (user) => {

    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};


export const registerUser = async (userData) => {

    const {
        name,
        email,
        password,
        role
    } = userData;

    const existingUser =
        await getUserByEmail(email);

    if (existingUser) {
        throw new ThrowError(
            409,
            "USER_EXISTS",
            "User already exists"
        );
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const user = await addUser({
        name,
        email,
        role,
        password: hashedPassword
    });

    return user;
};


export const loginUser = async (
    email,
    password
) => {

    const user =
        await getUserByEmail(email);

    if (!user) {
        throw new ThrowError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password"
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw new ThrowError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password"
        );
    }

    const token =
        generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

export const forgotPassword = async (email) => {

    const user =
        await getUserByEmail(email);

    if (!user) {
        throw new ThrowError(
            404,
            "USER_NOT_FOUND",
            "User not found"
        );
    }

    const resetToken =
        crypto.randomBytes(32).toString("hex");

    const resetTokenExpiry =
        new Date(
            Date.now() + 15 * 60 * 1000
        );

    await saveResetToken(
        user.id,
        resetToken,
        resetTokenExpiry
    );

    const resetLink =
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendMail({
        to: user.email,
        subject: "Reset Your Password",
        text: `Click the following link to reset your password: ${resetLink}`,
        html: `
            <h2>Reset Your Password</h2>

            <p>Hello ${user.name},</p>

            <p>
                We received a request to reset your password.
            </p>

            <p>
                Click the link below to reset your password:
            </p>

            <p>
                <a href="${resetLink}">
                    Reset Password
                </a>
            </p>

            <p>
                This link will expire in 15 minutes.
            </p>

            <p>
                If you did not request a password reset,
                you can safely ignore this email.
            </p>
        `,
    });

    return {
        message: "Password reset link sent successfully",
    };
};

export const resetPassword = async (
    resetToken,
    newPassword
) => {

    const user =
        await getUserByResetToken(resetToken);

    if (!user) {
        throw new ThrowError(
            400,
            "INVALID_RESET_TOKEN",
            "Invalid or expired reset link"
        );
    }

    const currentTime = new Date();

    if (
        !user.resetTokenExpiry ||
        new Date(user.resetTokenExpiry) <= currentTime
    ) {
        throw new ThrowError(
            400,
            "INVALID_RESET_TOKEN",
            "Invalid or expired reset link"
        );
    }

    const hashedPassword =
        await bcrypt.hash(newPassword, 10);

    const updated =
        await updatePasswordByResetToken(
            resetToken,
            hashedPassword
        );

    if (!updated) {
        throw new ThrowError(
            400,
            "PASSWORD_RESET_FAILED",
            "Unable to reset password"
        );
    }

    return {
        message: "Password reset successfully",
    };
};