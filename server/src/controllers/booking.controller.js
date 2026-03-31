const crypto = require("crypto");
const { appendBooking, getAllBookings } = require("../services/sheets.service");
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
    const { name, email, phone, state, district, pinCode, acres, cropType, date } = req.body;
    lockKey = `${email}:${phone}`;

    if (activeBookingLocks.has(lockKey)) {
      return res.status(429).json({
        success: false,
        message: "A booking request is already being processed for this contact.",
      });
    }

    activeBookingLocks.add(lockKey);

    const allBookings = await getAllBookings();

    const existingPending = allBookings.find((booking) =>
      (String(booking.Email || "").trim().toLowerCase() === email ||
        String(booking.Phone || "").replace(/\D/g, "") === phone) &&
      (!booking.Status || String(booking.Status).toLowerCase() === "pending")
    );

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
      Date: date,
      Status: "Pending",
      Remarks: ""
    };

    await appendBooking(bookingData);

    res.status(201).json({
      success: true,
      message: "Booking successful!"
    });

    fireAndForget("Booking Email Background Error", () =>
      sendBookingEmails({ name, email, phone, state, district, pinCode, acres, cropType, date })
    );
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
