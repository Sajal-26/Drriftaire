const crypto = require("crypto");
const rateLimit = require("express-rate-limit");

const getNormalizedString = (value) => (
  typeof value === "string" ? value.trim().toLowerCase() : ""
);

const getNormalizedPhone = (value) => (
  typeof value === "string" ? value.replace(/\D/g, "") : ""
);

const requestIdMiddleware = (req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};

const securityHeadersMiddleware = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
};

const bookingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = getNormalizedString(req.body?.email);
    const phone = getNormalizedPhone(req.body?.phone);
    return `booking:${email || "unknown-email"}:${phone || "unknown-phone"}`;
  },
  message: { message: "Too many booking attempts. Please try again shortly." },
});

const adminLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = getNormalizedString(req.body?.email);
    return `admin-login:${email || "anonymous"}`;
  },
  message: { message: "Too many login attempts. Please try again shortly." },
});

module.exports = {
  requestIdMiddleware,
  securityHeadersMiddleware,
  bookingRateLimiter,
  adminLoginRateLimiter,
};
