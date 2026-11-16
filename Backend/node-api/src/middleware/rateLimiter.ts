import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const publicLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_PUBLIC,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests from this IP address. Please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_AUTH,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: "TOO_MANY_AUTH_ATTEMPTS",
    message: "Too many sign-in attempts. Please try again after 15 minutes.",
  },
});

