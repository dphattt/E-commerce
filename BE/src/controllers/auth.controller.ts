import type { NextFunction, Request, Response } from "express";
import User from "@/services/User.service";
import { signToken } from "@/utils/jwt";
import { httpError } from "@/utils/http-error";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password) {
      throw httpError("email and password are required", 400);
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      throw httpError("Email already registered", 409);
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name || "",
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
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      throw httpError("email and password are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash",
    );
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
