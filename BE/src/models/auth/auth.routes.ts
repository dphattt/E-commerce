import { Router } from "express";
import * as authController from "@/models/auth/auth.controller";
import { validate } from "@/middlewares/validate.middleware";
import {
  loginLimiter,
  registerLimiter,
} from "@/middlewares/rate-limit.middleware";
import {
  loginBodySchema,
  registerBodySchema,
} from "@/models/auth/auth.validation";

const router = Router();

router.post(
  "/register",
  registerLimiter,
  validate(registerBodySchema),
  authController.register,
);
router.post(
  "/login",
  loginLimiter,
  validate(loginBodySchema),
  authController.login,
);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
