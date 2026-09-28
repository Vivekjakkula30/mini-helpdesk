import {registerUser, loginUser, forgotPassword, resetPassword} from "./auth.service.js";
import { successResponse } from "../../helpers/responseHelper.js";
import { validateRegister, validateLogin, validateForgetPassword } from "./auth.validator.js";

export const registerController = async (req, res, next) => {
    try {
        const userData = req.body;

        validateRegister(userData);

        const user = await registerUser(userData);

        return successResponse(res, 201, user);

    } catch (error){
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        validateLogin(req.body);

        const result = await loginUser(email, password);

        return successResponse(res, 200, result);

    } catch (error) {
        next(error);
    }
};


export const forgotPasswordController = async (req,res,next) => {
    try {
        const { email } = req.body;

        validateForgetPassword(req.body);

        const result = await forgotPassword(email);

        return successResponse(res, 200, result);

    } catch (error) {
        next(error);
    }
};

export const resetPasswordController = async (
    req,
    res,
    next
) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new ThrowError(
                400,
                "VALIDATION_ERROR",
                "Token and new password are required"
            );
        }

        if (
            typeof newPassword !== "string" ||
            newPassword.length < 6
        ) {
            throw new ThrowError(
                400,
                "VALIDATION_ERROR",
                "Password must be at least 6 characters"
            );
        }

        const result = await resetPassword(
            token,
            newPassword
        );

        return successResponse(res, 200, result);

    } catch (error) {
        next(error);
    }
};