const { sendCareerApplicationEmail } = require("../services/email.service");
const multer = require("multer");
const path = require("path");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'), false);
    }
  }
});

const createCareerApplication = [
  upload.single('resume'),
  async (req, res) => {
    try {
      const { name, email, phone, address, role, linkedin } = req.body;

      // Basic validation
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required." });
      }

      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }

      if (phone && !/^\d{10,15}$/.test(phone.replace(/\D/g, ""))) {
        return res.status(400).json({ message: "Please enter a valid phone number." });
      }

      // Prepare attachment if file exists
      let attachment = null;
      if (req.file) {
        attachment = {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      // Send email notification
      await sendCareerApplicationEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : "",
        address: address ? address.trim() : "",
        role: role ? role.trim() : "",
        linkedin: linkedin ? linkedin.trim() : "",
        attachment: attachment,
      });

      res.status(200).json({
        success: true,
        message: "Career application submitted successfully. We'll review your profile!",
      });
    } catch (error) {
      console.error("Career application error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit career application. Please try again.",
      });
    }
  }
];

module.exports = {
  createCareerApplication,
};