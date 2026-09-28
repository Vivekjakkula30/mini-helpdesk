import { getDashboard } from "./dashboard.service.js";
import { successResponse } from "../../helpers/responseHelper.js";

export const getDashboardController = async (req, res, next) => {
    try {
        const userId = Number(req.user.id);
        const role = req.user.role;

        const dashboard = await getDashboard(
            userId,
            role
        );

        return successResponse(
            res,
            200,
            dashboard
        );

    } catch (error) {
        next(error);
    }
};