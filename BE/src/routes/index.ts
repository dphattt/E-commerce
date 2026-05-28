import { Router } from "express";
import healthRoutes from "@/modules/health/health.routes";
import authRoutes from "@/modules/auth/auth.routes";
import userRoutes from "@/modules/users/users.routes";
import productsRoutes from "@/modules/products/products.routes";
import cartRoutes from "@/modules/cart/cart.routes";
import categoriesRoutes from "@/modules/categories/categories.routes";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/categories", categoriesRoutes);

export default router;
