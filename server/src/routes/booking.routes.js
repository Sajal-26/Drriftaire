const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/booking.controller");
const { bookingRateLimiter } = require("../middleware/security.middleware");

const validateBooking = (req, res, next) => {
  const rawPhone = typeof req.body.phone === "string" ? req.body.phone.replace(/\D/g, "") : "";
  const normalizedPhone = rawPhone.length === 12 && rawPhone.startsWith("91")
    ? rawPhone.slice(2)
    : rawPhone;

  const fields = {
    name: typeof req.body.name === "string" ? req.body.name.trim() : "",
    email: typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "",
    phone: normalizedPhone,
    state: typeof req.body.state === "string" ? req.body.state.trim() : "",
    district: typeof req.body.district === "string" ? req.body.district.trim() : "",
    pinCode: typeof req.body.pinCode === "string" ? req.body.pinCode.trim() : String(req.body.pinCode || "").trim(),
    acres: Number(req.body.acres),
    cropType: typeof req.body.cropType === "string" ? req.body.cropType.trim() : "",
    pesticideType: typeof req.body.pesticideType === "string" ? req.body.pesticideType.trim() : "",
    date: typeof req.body.date === "string" ? req.body.date.trim() : "",
  };

  if (!fields.name || !fields.phone || !fields.state || !fields.district || !fields.pinCode || !fields.acres || !fields.cropType || !fields.pesticideType || !fields.date) {
    return res.status(400).json({ message: "All booking fields are required." });
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (fields.email && !emailRegex.test(fields.email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  if (!/^\d{10,15}$/.test(fields.phone)) {
    return res.status(400).json({ message: "Please enter a valid phone number." });
  }

  if (!/^\d{4,10}$/.test(fields.pinCode)) {
    return res.status(400).json({ message: "Please enter a valid pin code." });
  }

  if (!Number.isFinite(fields.acres) || fields.acres <= 0 || fields.acres > 100000) {
    return res.status(400).json({ message: "Acres must be a valid positive number." });
  }

  const bookingDate = new Date(`${fields.date}T00:00:00`);
  if (Number.isNaN(bookingDate.getTime())) {
    return res.status(400).json({ message: "Please enter a valid booking date." });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    return res.status(400).json({ message: "Booking date cannot be in the past." });
  }

  req.body = fields;
  next();
};

router.post("/book", bookingRateLimiter, validateBooking, createBooking);

module.exports = router;
