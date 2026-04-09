const express = require("express");
const router = express.Router();
const { createCareerApplication } = require("../controllers/career.controller");
const { generalRateLimiter } = require("../middleware/security.middleware");

router.post("/apply", generalRateLimiter, createCareerApplication);

module.exports = router;