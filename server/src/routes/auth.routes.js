const express = require("express");
const router = express.Router();
const { googleAuth } = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.post("/google", googleAuth);

router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    note: "This data came from the JWT, not the database."
  });
});

module.exports = router;