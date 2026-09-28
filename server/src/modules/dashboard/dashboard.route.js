import express from "express";

import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {getDashboardController} from "./dashboard.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getDashboardController);

export default router;