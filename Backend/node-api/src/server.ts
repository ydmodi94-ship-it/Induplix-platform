import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function startServer() {
  try {
    await connectDB();
    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          env: env.NODE_ENV,
          docsUrl: `http://localhost:${env.PORT}/api/docs`,
        },
        `Induplix Backend API listening on port ${env.PORT}`
      );
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        logger.info("Process terminated cleanly.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (err) {
    logger.error({ err }, "Fatal startup error. Server aborted.");
    process.exit(1);
  }
}

startServer();

