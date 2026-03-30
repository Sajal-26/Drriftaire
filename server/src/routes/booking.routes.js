const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/booking.controller");

const validateBooking = (req, res, next) => {
  const { name, email, phone, state, district, pinCode, acres, cropType, date } = req.body;
  
  if (!name || !email || !phone || !state || !district || !pinCode || !acres || !cropType || !date) {
    return res.status(400).json({ message: "All booking fields are required." });
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  next();
};

router.post("/book", validateBooking, createBooking);

module.exports = router;
