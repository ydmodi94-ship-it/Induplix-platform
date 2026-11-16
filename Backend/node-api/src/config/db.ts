import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

let isConnected = false;

export async function connectDB(uri: string = env.MONGODB_URI): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, {
      autoIndex: !env.isProduction, // In production, manage indexes deliberately
    });
    isConnected = true;
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to MongoDB");
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return;
  }
  await mongoose.disconnect();
  isConnected = false;
  logger.info("Disconnected from MongoDB");
}

