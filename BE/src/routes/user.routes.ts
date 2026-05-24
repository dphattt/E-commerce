import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware";
import * as userController from "@/controllers/user.controller";

const router = Router();

router.get("/me", requireAuth, userController.me);

export default router;
