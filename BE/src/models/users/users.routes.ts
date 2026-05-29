import { Router } from "express";
import { requireAuth } from "@/middlewares/auth.middleware";
import * as userController from "@/models/users/users.controller";

const router = Router();

router.get("/me", requireAuth, userController.me);

export default router;
