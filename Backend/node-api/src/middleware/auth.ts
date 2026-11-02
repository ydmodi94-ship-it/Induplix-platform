import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { Session } from "../modules/auth/session.model.js";
import { User } from "../modules/auth/user.model.js";
import { env } from "../config/env.js";
import { AppError } from "./error.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        displayName: string;
        role: string;
      };
      session?: {
        id: string;
        csrfSecret: string;
      };
    }
  }
}

export function createSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function createCsrfSecret(): string {
  return crypto.randomBytes(24).toString("hex");
}

export function generateCsrfToken(csrfSecret: string): string {
  const salt = crypto.randomBytes(8).toString("hex");
  const hash = crypto.createHmac("sha256", env.SESSION_SECRET).update(`${salt}:${csrfSecret}`).digest("hex");
  return `${salt}.${hash}`;
}

export function verifyCsrfToken(token: string, csrfSecret: string): boolean {
  if (!token || !csrfSecret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const expected = crypto.createHmac("sha256", env.SESSION_SECRET).update(`${salt}:${csrfSecret}`).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const sessionId = req.cookies?.[env.SESSION_NAME];

  if (!sessionId) {
    next(new AppError("Authentication required. Please log in.", 401, "UNAUTHORIZED"));
    return;
  }

  const session = await Session.findById(sessionId);

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await Session.findByIdAndDelete(sessionId);
    }
    res.clearCookie(env.SESSION_NAME);
    next(new AppError("Session expired or invalid. Please sign in again.", 401, "UNAUTHORIZED"));
    return;
  }

  const user = await User.findById(session.userId);

  if (!user || !user.isActive) {
    await Session.findByIdAndDelete(sessionId);
    res.clearCookie(env.SESSION_NAME);
    next(new AppError("User account is inactive or no longer exists.", 401, "UNAUTHORIZED"));
    return;
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName,
    role: user.role,
  };

  req.session = {
    id: session._id,
    csrfSecret: session.csrfSecret,
  };

  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Authentication required.", 401, "UNAUTHORIZED"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError("You do not have permission to perform this action.", 403, "FORBIDDEN"));
      return;
    }

    next();
  };
}

export function requireCsrf(req: Request, _res: Response, next: NextFunction): void {
  // Safe read methods bypass CSRF check
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const csrfToken = (req.headers["x-csrf-token"] || req.body?._csrf) as string | undefined;

  if (!req.session?.csrfSecret || !csrfToken) {
    next(new AppError("CSRF token missing or invalid.", 403, "CSRF_TOKEN_INVALID"));
    return;
  }

  const isValid = verifyCsrfToken(csrfToken, req.session.csrfSecret);
  if (!isValid) {
    next(new AppError("Invalid or expired CSRF token.", 403, "CSRF_TOKEN_INVALID"));
    return;
  }

  next();
}

