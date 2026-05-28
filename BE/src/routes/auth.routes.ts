import { Router } from "express";
import * as authController from "@/controllers/auth.controller";
import { validate } from "@/middlewares/validate.middleware";
import {
  loginBodySchema,
  registerBodySchema,
} from "@/validations/auth.validation";

const router = Router();

router.post("/register", validate(registerBodySchema), authController.register);
router.post("/login", validate(loginBodySchema), authController.login);

export default router;
