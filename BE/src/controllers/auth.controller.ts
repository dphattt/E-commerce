import type { NextFunction, Request, Response } from "express";
import User from "@/models/User.model";
import { signToken } from "@/utils/jwt";
import { httpError } from "@/utils/http-error";
import type {
  LoginBody,
  RegisterBody,
} from "@/validations/auth.validation";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body as RegisterBody;

    const exists = await User.findOne({ email });
    if (exists) {
      throw httpError("Email already registered", 409);
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      name,
    });

    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as LoginBody;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      throw httpError("Invalid credentials", 401);
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      throw httpError("Invalid credentials", 401);
    }

    const token = signToken({ sub: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    next(e);
  }
}
