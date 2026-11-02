import { Router, type Request, type Response } from "express";
import { z } from "zod";
import argon2 from "argon2";
import { User } from "./user.model.js";
import { Session } from "./session.model.js";
import {
  createSessionId,
  createCsrfSecret,
  generateCsrfToken,
  requireAuth,
} from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/rateLimiter.js";
import { AppError } from "../../middleware/error.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * 5. GET /api/v1/auth/csrf
 * Issue a CSRF token for the active session (or create a pre-auth CSRF token)
 */
authRouter.get("/csrf", async (req: Request, res: Response) => {
  const sessionId = req.cookies?.[env.SESSION_NAME];
  let csrfSecret: string;

  if (sessionId) {
    const session = await Session.findById(sessionId);
    if (session && session.expiresAt > new Date()) {
      csrfSecret = session.csrfSecret;
      const csrfToken = generateCsrfToken(csrfSecret);
      res.json({
        success: true,
        csrfToken,
      });
      return;
    }
  }

  // Pre-auth CSRF token using fallback secret derived for guest state
  csrfSecret = createCsrfSecret();
  const csrfToken = generateCsrfToken(csrfSecret);
  res.json({
    success: true,
    csrfToken,
  });
});

/**
 * 6. POST /api/v1/auth/login
 * Verify password, rotate session, set secure cookie
 */
authRouter.post("/login", authLimiter, async (req: Request, res: Response, next: import("express").NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isActive) {
      // Avoid user enumeration
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const isValidPassword = await argon2.verify(user.passwordHash, password);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    // Clean up any old sessions for this user on this client if cookie was present
    const oldSessionId = req.cookies?.[env.SESSION_NAME];
    if (oldSessionId) {
      await Session.findByIdAndDelete(oldSessionId);
    }

    // Generate new session (Session Rotation)
    const newSessionId = createSessionId();
    const csrfSecret = createCsrfSecret();
    const expiresAt = new Date(Date.now() + env.SESSION_MAX_AGE_MS);

    await Session.create({
      _id: newSessionId,
      userId: user._id,
      role: user.role,
      csrfSecret,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      expiresAt,
    });

    // Update user last login
    user.lastLoginAt = new Date();
    await user.save();

    // Set secure HTTP-only cookie
    res.cookie(env.SESSION_NAME, newSessionId, {
      httpOnly: true,
      secure: env.isProduction, // In production, require HTTPS
      sameSite: env.isProduction ? "strict" : "lax",
      maxAge: env.SESSION_MAX_AGE_MS,
      path: "/",
    });

    const csrfToken = generateCsrfToken(csrfSecret);

    logger.info({ userId: user._id, email: user.email }, "Staff user logged in successfully");

    res.json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      csrfToken,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 7. POST /api/v1/auth/logout
 * Invalidate server-side session and remove cookie
 */
authRouter.post("/logout", async (req: Request, res: Response) => {
  const sessionId = req.cookies?.[env.SESSION_NAME];
  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }

  res.clearCookie(env.SESSION_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "strict" : "lax",
    path: "/",
  });

  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

/**
 * 8. GET /api/v1/auth/me
 * Return current authenticated staff user context
 */
authRouter.get("/me", requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
});

