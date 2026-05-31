import type { CookieOptions, NextFunction, Request, Response } from "express";
import { createHash, randomBytes } from "node:crypto";
import User from "@/models/users/User.model";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from "@/utils/jwt";
import { httpError } from "@/utils/http-error";
import type {
  ForgotPasswordBody,
  LoginBody,
  RegisterBody,
  ResetPasswordBody,
} from "@/models/auth/auth.validation";

const REFRESH_COOKIE = "refreshToken";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TOKEN_BYTES = 32;
const PASSWORD_RESET_EXPIRES_MS = 60 * 60 * 1000;
const PASSWORD_RESET_MESSAGE =
  "If an account exists for this email, password reset instructions have been sent.";

function refreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: SEVEN_DAYS_MS,
  };
}

function issueTokens(res: Response, payload: JwtPayload): string {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
  return accessToken;
}

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function buildResetUrl(token: string): string | undefined {
  const origin =
    process.env.APP_ORIGIN ||
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN?.split(",")[0]?.trim();
  if (!origin || origin === "*") return undefined;
  return `${origin.replace(/\/$/, "")}/account/reset-password?token=${encodeURIComponent(
    token,
  )}`;
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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

    const token = issueTokens(res, { sub: user.id, email: user.email });
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

    const token = issueTokens(res, { sub: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/auth/refresh
 * Reads the refresh token from the httpOnly cookie, verifies it, and
 * issues a fresh access token (plus a rotated refresh cookie). The
 * client never sees the refresh value.
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies = (req as Request & { cookies?: Record<string, string> })
      .cookies;
    const token = cookies?.[REFRESH_COOKIE];
    if (!token) {
      throw httpError("Refresh token missing", 401);
    }

    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw httpError("Invalid or expired refresh token", 401);
    }

    const accessToken = issueTokens(res, {
      sub: payload.sub,
      email: payload.email,
    });
    res.json({ token: accessToken });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/auth/logout
 * Clears the refresh cookie. The client is also expected to drop its
 * in-memory access token.
 */
export function logout(_req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE, {
    ...refreshCookieOptions(),
    maxAge: undefined,
  });
  res.status(204).end();
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body as ForgotPasswordBody;
    const user = await User.findOne({ email }).select("_id");
    const response: {
      message: string;
      resetToken?: string;
      resetUrl?: string;
    } = { message: PASSWORD_RESET_MESSAGE };

    if (user) {
      const resetToken = randomBytes(PASSWORD_RESET_TOKEN_BYTES).toString("hex");
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetTokenHash: hashResetToken(resetToken),
            passwordResetExpiresAt: new Date(
              Date.now() + PASSWORD_RESET_EXPIRES_MS,
            ),
          },
        },
      );

      if (process.env.NODE_ENV !== "production") {
        response.resetToken = resetToken;
        response.resetUrl = buildResetUrl(resetToken);
      }
    }

    res.json(response);
  } catch (e) {
    next(e);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, password } = req.body as ResetPasswordBody;
    const user = await User.findOne({
      passwordResetTokenHash: hashResetToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("_id");

    if (!user) {
      throw httpError("Invalid or expired password reset token", 400);
    }

    const passwordHash = await User.hashPassword(password);
    await User.updateOne(
      { _id: user._id },
      {
        $set: { passwordHash },
        $unset: {
          passwordResetTokenHash: "",
          passwordResetExpiresAt: "",
        },
      },
    );

    res.json({ message: "Password has been reset." });
  } catch (e) {
    next(e);
  }
}
