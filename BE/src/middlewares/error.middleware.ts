import type { NextFunction, Request, Response } from "express";

interface MongoDuplicateError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
}

interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: "Not found", path: req.originalUrl });
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const mongoErr = err as MongoDuplicateError;
  if (mongoErr.code === 11000) {
    res.status(409).json({
      message: "Duplicate value",
      ...(mongoErr.keyPattern && { fields: Object.keys(mongoErr.keyPattern) }),
    });
    return;
  }

  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "production" && err.stack) {
    console.error(err.stack);
  } else if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message });
}
