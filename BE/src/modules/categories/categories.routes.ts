import { Router } from "express";
import * as categoriesController from "@/modules/categories/categories.controller";

const router = Router();

router.get("/", categoriesController.getCategories);

export default router;
