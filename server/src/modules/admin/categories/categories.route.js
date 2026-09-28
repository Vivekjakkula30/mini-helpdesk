import express from "express";

import {
  getCategoriesController,
  createCategoryController,
  getCategoryByIdController,
  updateCategoryByController,
  deleteCategoryController,
  checkCategoryInUseController
} from "./categories.controller.js";

import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { requireAdmin } from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Any authenticated user can get categories
router.get("/", getCategoriesController);

// Admin-only category management
router.use(requireAdmin);

router.get("/usage/:id", checkCategoryInUseController);

router.post("/", createCategoryController);

router.get("/:id", getCategoryByIdController);

router.patch("/:id", updateCategoryByController);

router.delete("/:id", deleteCategoryController);

export default router;