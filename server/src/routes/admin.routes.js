const express = require("express");
const router = express.Router();
const { adminLogin, getBookings, changeBookingStatus, getAnalytics } = require("../controllers/admin.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { adminLoginRateLimiter } = require("../middleware/security.middleware");

router.post("/login", adminLoginRateLimiter, adminLogin);


const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

router.get("/bookings", authenticateToken, verifyAdmin, getBookings);
router.patch("/bookings/:id/status", authenticateToken, verifyAdmin, changeBookingStatus);
router.get("/analytics", authenticateToken, verifyAdmin, getAnalytics);

module.exports = router;
