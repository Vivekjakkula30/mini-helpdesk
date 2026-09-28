import express from "express";

import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUserSummary,
} from "./users.controller.js";

import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { requireAdmin } from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

// All user-management routes require authentication
router.use(authMiddleware);

// All user-management routes require the Admin role
router.use(requireAdmin);

// Get all active users
router.get("/", getUsers);

// Get user summary
router.get("/summary", getUserSummary);

// Create a new user
router.post("/", createUser);

// Get a single user by ID
router.get("/:id", getUserById);

// Update a user's email or role
router.patch("/:id", updateUser);

// Soft delete a user
router.delete("/:id", deleteUser);

export default router;