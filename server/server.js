require("dotenv").config();

const app = require("./src/app");
const { assertEnv } = require("./src/config/env");

const PORT = process.env.PORT || 5000;

try {
  assertEnv();
} catch (error) {
  console.error("Startup configuration error:", error.message);
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

console.log("ENV CHECK", {
  NODE_ENV: process.env.NODE_ENV,
  hasJwtSecret: Boolean(process.env.JWT_SECRET),
  hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
  hasAdminPasswordHash: Boolean(process.env.ADMIN_PASSWORD_HASH),
  hasGoogleSheetId: Boolean(process.env.GOOGLE_SHEET_ID),
  hasGoogleServiceEmail: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
  hasGooglePrivateKey: Boolean(process.env.GOOGLE_PRIVATE_KEY),
  hasEmailUser: Boolean(process.env.EMAIL_USER),
  hasEmailPass: Boolean(process.env.EMAIL_PASS),
  corsOrigins: process.env.CORS_ORIGINS,
});


process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
