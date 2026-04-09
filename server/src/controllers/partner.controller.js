const { sendPartnerInterestEmail } = require("../services/email.service");

const createPartnerInterest = async (req, res) => {
  try {
    const { name, phone, email, address, pincode } = req.body;

    // Basic validation
    if (!name || !phone || !email || !address || !pincode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ""))) {
      return res.status(400).json({ message: "Please enter a valid phone number." });
    }

    if (!/^\d{4,10}$/.test(pincode)) {
      return res.status(400).json({ message: "Please enter a valid pincode." });
    }

    // Send email notification
    await sendPartnerInterestEmail({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      pincode: pincode.trim(),
    });

    res.status(200).json({
      success: true,
      message: "Partner interest submitted successfully. We'll be in touch soon!",
    });
  } catch (error) {
    console.error("Partner interest error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit partner interest. Please try again.",
    });
  }
};

module.exports = {
  createPartnerInterest,
};