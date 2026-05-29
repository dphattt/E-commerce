import type { NextFunction, Request, Response } from "express";
import User from "@/models/users/User.model";
import { httpError } from "@/utils/http-error";

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      throw httpError("Unauthorized", 401);
    }

    const user = await User.findById(req.user.id).select(
      "email name createdAt",
    );
    if (!user) {
      throw httpError("User not found", 404);
    }

    res.json({ user });
  } catch (e) {
    next(e);
  }
}
