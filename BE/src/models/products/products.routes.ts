import { Router } from "express";
import * as productsController from "@/models/products/products.controller";

const router = Router();

router.get("/", productsController.getProducts);
router.get("/slug/:slug", productsController.getProductBySlug);
router.get("/:id", productsController.getProductById);

export default router;
