const express = require("express");
const router = express.Router();
const { googleAuth } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { createBooking } = require("../controllers/booking.controller");

router.post("/google", googleAuth);
router.post("/book", createBooking);

router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    note: "This data came from the JWT, not the database."
  });
});

module.exports = router;