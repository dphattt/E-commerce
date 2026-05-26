import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware";
import * as cartController from "@/controllers/cart.controller";

const router = Router();

// Tất cả cart routes đều yêu cầu đăng nhập
router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items/:sku", cartController.updateItem);
router.delete("/items/:sku", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
