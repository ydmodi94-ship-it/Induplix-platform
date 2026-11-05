import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number = 400, code: string = "BAD_REQUEST", details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const requestId = (req as any).id || req.headers["x-request-id"] || "unknown";

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "The request failed validation checks.",
      errors: formattedErrors,
      requestId,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
      requestId,
    });
    return;
  }

  // Fallback for unhandled unexpected server errors
  logger.error({ err, requestId }, "Unhandled internal error");

  res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred. Please try again later.",
    requestId,
  });
}

