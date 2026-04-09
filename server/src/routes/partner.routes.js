const express = require("express");
const router = express.Router();
const { createPartnerInterest } = require("../controllers/partner.controller");
const { generalRateLimiter } = require("../middleware/security.middleware");

router.post("/interest", generalRateLimiter, createPartnerInterest);

module.exports = router;