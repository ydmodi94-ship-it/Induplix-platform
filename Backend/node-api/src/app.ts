import express, { type Application } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { errorHandler } from "./middleware/error.js";
import { publicRouter } from "./modules/public/public.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Application {
  const app = express();

  // 1. Trust proxy for rate limiting behind reverse proxies (NGINX/Cloudflare/Fly/Render)
  app.set("trust proxy", 1);

  // 2. Request identifier
  app.use(requestIdMiddleware);

  // 3. Security headers
  app.use(
    helmet({
      contentSecurityPolicy: env.isProduction ? undefined : false,
    })
  );

  // 4. CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        if (env.corsOriginsList.includes(origin) || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-csrf-token", "x-request-id"],
    })
  );

  // 5. Body parser limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  // 6. OpenAPI Documentation via Swagger UI
  try {
    const openApiDoc = YAML.load(path.join(__dirname, "docs", "openapi.yaml"));
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
  } catch (err) {
    // Graceful fallback if openapi spec path differs in dev/test
  }

  // 7. System health endpoint (Route 18)
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "induplix-node-api",
      version: "1.0.0",
    });
  });

  // 8. Modular Route Registration
  app.use("/api/v1/public", publicRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/admin", adminRouter);

  // 9. Centralized safe error handling
  app.use(errorHandler);

  return app;
}

