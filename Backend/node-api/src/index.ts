import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

// Ensure DB is connected in serverless execution environment
await connectDB();

const app = createApp();

export default app;
