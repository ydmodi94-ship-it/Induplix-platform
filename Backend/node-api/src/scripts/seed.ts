import argon2 from "argon2";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../modules/auth/user.model.js";
import { logger } from "../config/logger.js";

async function seed() {
  await connectDB();

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@induplix.com";
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "InduplixAdmin2026!";
  const adminName = process.env.INITIAL_ADMIN_NAME || "Induplix Founder & Owner";

  const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });

  if (existingUser) {
    logger.info({ email: adminEmail }, "Admin user already exists. Skipping creation.");
  } else {
    const passwordHash = await argon2.hash(adminPassword);
    await User.create({
      email: adminEmail.toLowerCase(),
      passwordHash,
      displayName: adminName,
      role: "owner_admin",
      isActive: true,
    });
    logger.info(
      { email: adminEmail },
      "Created initial owner_admin user successfully."
    );
  }

  await disconnectDB();
  logger.info("Database seeding finished.");
}

seed().catch((err) => {
  logger.error({ err }, "Seeding failed");
  process.exit(1);
});

