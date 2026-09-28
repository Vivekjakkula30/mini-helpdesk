import jwt from "jsonwebtoken";
import ThrowError from "../errors/ThrowError.js";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new ThrowError(
                401,
                "UNAUTHORIZED",
                "Authorization token is required"
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new ThrowError(
                401,
                "UNAUTHORIZED",
                "Authorization token is required"
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

    

        next();

    } catch (error) {

        if (error.name === "JsonWebTokenError") {
            return next(
                new ThrowError(
                    401,
                    "UNAUTHORIZED",
                    "Invalid token"
                )
            );
        }

        if (error.name === "TokenExpiredError") {
            return next(
                new ThrowError(
                    401,
                    "UNAUTHORIZED",
                    "Token expired"
                )
            );
        }

        next(error);
    }
};