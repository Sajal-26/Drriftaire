const { appendBooking } = require("../services/sheets.service");
const { sendBookingEmails } = require("../services/email.service");

const createBooking = async (req, res) => {
  try {
    const { name, email, phone, location, farmSize, date } = req.body;

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
    sendBookingEmails({ name, email, phone, location, farmSize, date });

    res.status(201).json({
      success: true,
      message: "Booking successful!"
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Failed to process booking." });
  }
};

module.exports = { createBooking };