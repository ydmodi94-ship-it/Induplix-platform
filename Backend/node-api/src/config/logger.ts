import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: env.isTest ? "silent" : env.isProduction ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "passwordHash",
      "sessionSecret",
      "token",
      "*.password",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

