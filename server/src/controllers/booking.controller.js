const { appendBooking, getAllBookings } = require("../services/sheets.service");
const { sendBookingEmails, sendDuplicateBookingEmail } = require("../services/email.service");

const createBooking = async (req, res) => {
  try {
    const { name, email, phone, state, district, pinCode, acres, cropType, date } = req.body;

    // --- NEW: Prevent duplicate pending bookings ---
    const allBookings = await getAllBookings();
    
    // Check if the same email or phone number already has a "Pending" status booking
    const existingPending = allBookings.find(b => 
      (b.Email === email || b.Phone === phone) && 
      (!b.Status || b.Status.toLowerCase() === "pending")
    );

    if (existingPending) {
      // Send reminder email to the user
      await sendDuplicateBookingEmail({ name: existingPending.Name || name, email });

      return res.status(409).json({ 
        success: false, 
        message: "You already have a pending booking. An email reminder has been sent." 
      });
    }
    // -----------------------------------------------

    const bookingData = {
      Timestamp: new Date().toLocaleString(),
      Name: name,
      Email: email,
      Phone: phone,
      State: state,
      District: district,
      'Pin Code': pinCode,
      Acres: acres,
      'Crop Type': cropType,
      Date: date,
      Status: "Pending",
      Remarks: ""
    };

    await appendBooking(bookingData);
    sendBookingEmails({ name, email, phone, state, district, pinCode, acres, cropType, date });

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