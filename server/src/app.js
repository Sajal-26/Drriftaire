const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/booking.routes");
const adminRoutes = require("./routes/admin.routes");
const partnerRoutes = require("./routes/partner.routes");
const contactRoutes = require("./routes/contact.routes");
const careerRoutes = require("./routes/career.routes");
const {
  requestIdMiddleware,
  securityHeadersMiddleware,
} = require("./middleware/security.middleware");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(requestIdMiddleware);
app.use(securityHeadersMiddleware);
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/career", careerRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, _next) => {
  console.error(`[${req.requestId}]`, err);

  return res.status(500).json({ message: "Internal server error.", requestId: req.requestId });
});

module.exports = app;
