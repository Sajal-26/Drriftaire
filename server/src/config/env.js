const requiredEnv = [
  "JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "EMAIL_USER",
  "EMAIL_PASS",
  "ADMIN_EMAIL",
];

const assertEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD) {
    missing.push("ADMIN_PASSWORD_HASH or ADMIN_PASSWORD");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if ((process.env.JWT_SECRET || "").length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }

  if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGINS) {
    throw new Error("CORS_ORIGINS must be set in production.");
  }
};

const getAllowedOrigins = () => {
  const rawOrigins = process.env.CORS_ORIGINS || "";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

module.exports = {
  assertEnv,
  getAllowedOrigins,
};
