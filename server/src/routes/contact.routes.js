const express = require("express");
const router = express.Router();
const { createContactInquiry } = require("../controllers/contact.controller");
const { generalRateLimiter } = require("../middleware/security.middleware");

router.post("/inquiry", generalRateLimiter, createContactInquiry);

module.exports = router;