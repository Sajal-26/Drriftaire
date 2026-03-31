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

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
