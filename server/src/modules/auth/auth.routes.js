import express from "express";

import {
    loginController,
    registerController,
    forgotPasswordController,
    resetPasswordController
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forget-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController)

export default router;