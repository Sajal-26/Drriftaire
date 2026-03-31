const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/booking.routes");
const adminRoutes = require("./routes/admin.routes");
const { getAllowedOrigins } = require("./config/env");
const {
  requestIdMiddleware,
  securityHeadersMiddleware,
} = require("./middleware/security.middleware");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = getAllowedOrigins();

app.use(requestIdMiddleware);
app.use(securityHeadersMiddleware);
app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== "production" && /localhost|127\.0\.0\.1/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed."));
  },
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, _next) => {
  console.error(`[${req.requestId}]`, err);

  if (err?.message === "CORS origin not allowed.") {
    return res.status(403).json({ message: "Origin not allowed." });
  }

  return res.status(500).json({ message: "Internal server error.", requestId: req.requestId });
});

module.exports = app;
