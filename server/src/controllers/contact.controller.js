const { sendContactEmail } = require("../services/email.service");

const createContactInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ""))) {
      return res.status(400).json({ message: "Please enter a valid phone number." });
    }

    // Send email notification
    await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
    });

    res.status(200).json({
      success: true,
      message: "Contact inquiry submitted successfully. We'll get back to you soon!",
    });
  } catch (error) {
    console.error("Contact inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact inquiry. Please try again.",
    });
  }
};

module.exports = {
  createContactInquiry,
};