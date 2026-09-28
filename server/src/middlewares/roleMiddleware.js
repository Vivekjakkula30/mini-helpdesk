import ThrowError from "../errors/ThrowError.js";

export const requireAgent = (req, res, next) => {
    try {
        if (req.user.role !== "AGENT") {
            throw new ThrowError(
                403,
                "FORBIDDEN",
                "Agent access required"
            );
        }

        next();

    } catch (error) {
        next(error);
    }
};

export const requireAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "ADMIN") {
            throw new ThrowError(
                403,
                "FORBIDDEN",
                "Admin access required"
            );
        }

        next();

    } catch (error) {
        next(error);
    }
};

export const requireReporter = (req, res, next) => {
    try {
        if (req.user.role !== "REPORTER") {
            throw new ThrowError(
                403,
                "FORBIDDEN",
                "Reporter access required"
            );
        }

        next();

    } catch (error) {
        next(error);
    }
};