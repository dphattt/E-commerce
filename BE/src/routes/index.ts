import { Router } from "express";
import healthRoutes from "@/models/health/health.routes";
import authRoutes from "@/models/auth/auth.routes";
import userRoutes from "@/models/users/users.routes";
import productsRoutes from "@/models/products/products.routes";
import cartRoutes from "@/models/cart/cart.routes";
import categoriesRoutes from "@/models/categories/categories.routes";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/categories", categoriesRoutes);

export default router;
