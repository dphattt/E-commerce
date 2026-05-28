import { Router } from "express";
import healthRoutes from "@/routes/health.routes";
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import productsRoutes from "@/routes/products.routes";
import cartRoutes from "@/routes/cart.routes";
import categoriesRoutes from "@/routes/categories.routes";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/categories", categoriesRoutes);

export default router;
