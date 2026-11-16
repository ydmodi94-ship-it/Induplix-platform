import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  APP_BASE_URL: z.string().url().default("http://localhost:5000"),
  CORS_ORIGINS: z
    .string()
    .default(
      "http://localhost:8080,http://localhost:3000,http://localhost:5173,http://127.0.0.1:8080,http://127.0.0.1:3000,http://127.0.0.1:5173"
    ),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long").default("change-this-to-a-very-secure-random-string-at-least-32-chars-long"),
  SESSION_NAME: z.string().default("induplix.sid"),
  SESSION_MAX_AGE_MS: z.coerce.number().default(86400000), // 24 hours
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 mins
  RATE_LIMIT_MAX_PUBLIC: z.coerce.number().default(100),
  RATE_LIMIT_MAX_AUTH: z.coerce.number().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid configuration settings in environment:", JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Invalid application configuration. Fix environment variables and restart.");
}

export const env = {
  ...parsed.data,
  corsOriginsList: parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
  isProduction: parsed.data.NODE_ENV === "production",
  isTest: parsed.data.NODE_ENV === "test",
};

