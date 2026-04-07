const crypto = require("crypto");
const { insertBooking, getAllBookings } = require("../services/supabase.service");
const { sendBookingEmails, sendDuplicateBookingEmail } = require("../services/email.service");

const activeBookingLocks = new Set();
const fireAndForget = (label, task) => {
  Promise.resolve()
    .then(task)
    .catch((error) => {
      console.error(`${label}:`, error);
    });
};

const createBooking = async (req, res) => {
  let lockKey;

  try {
    const { name, email, phone, state, district, pinCode, acres, cropType, pesticideType, date } = req.body;
    lockKey = `${email || 'anon'}:${phone}`;

    if (activeBookingLocks.has(lockKey)) {
      return res.status(429).json({
        success: false,
        message: "A booking request is already being processed for this contact.",
      });
    }

    activeBookingLocks.add(lockKey);

    const allBookings = await getAllBookings();

    const existingPending = allBookings.find((booking) => {
      const dbEmail = String(booking.Email || "").trim().toLowerCase();
      const dbPhone = String(booking.Phone || "").replace(/\D/g, "");
      const isPending = !booking.Status || String(booking.Status).toLowerCase() === "pending";

      const emailMatch = email && dbEmail === email;
      const phoneMatch = dbPhone === phone;

      return (emailMatch || phoneMatch) && isPending;
    });

    if (existingPending) {
      fireAndForget("Duplicate Email Background Error", () =>
        sendDuplicateBookingEmail({ name: existingPending.Name || name, email })
      );

      return res.status(409).json({
        success: false,
        message: "You already have a pending booking. An email reminder has been sent."
      });
    }

    const bookingData = {
      "Booking ID": `BK-${crypto.randomUUID()}`,
      Timestamp: new Date().toISOString(),
      Name: name,
      Email: email,
      Phone: phone,
      State: state,
      District: district,
      'Pin Code': pinCode,
      Acres: acres,
      'Crop Type': cropType,
      'Pesticide Type': pesticideType,
      Date: date,
      Status: "Pending",
      Remarks: ""
    };

    await insertBooking(bookingData);
    await sendBookingEmails({ 
      ...req.body, 
      bookingId: bookingData["Booking ID"] 
    });

    res.status(201).json({
      success: true,
      message: "Booking successful!"
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Failed to process booking." });
  } finally {
    if (lockKey) {
      activeBookingLocks.delete(lockKey);
    }
  }
};

module.exports = { createBooking };
