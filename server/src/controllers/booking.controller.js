const { appendBooking } = require("../services/sheets.service");
const nodemailer = require("nodemailer");

const createBooking = async (req, res) => {
  try {
    const {name, email, phone, location, farmSize, date } = req.body;

    const bookingData = {
      Timestamp: new Date().toLocaleString(),
      Name: name,
      Email: email,
      Phone: phone,
      Location: location,
      Size: farmSize,
      Date: date,
      Status: "Pending"
    };

    await appendBooking(bookingData);

    res.status(201).json({ 
      success: true, 
      message: "Booking successful! Check your email for confirmation." 
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Failed to process booking." });
  }
};

module.exports = { createBooking };