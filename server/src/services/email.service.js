const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  family: 4, // Force IPv4 to avoid IPv6 connectivity issues
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps with some cloud network restrictions
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Transporter Error:", err);
  } else {
    console.log("✅ Email server ready");
  }
});

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatFromAddress = () =>
  `"Drriftaire" <${process.env.EMAIL_USER}>`;

const sendBookingEmails = async ({
  name,
  email,
  phone,
  state,
  district,
  pinCode,
  acres,
  cropType,
  date,
}) => {
  try {
    const results = await Promise.allSettled([
      transporter.sendMail({
        from: formatFromAddress(),
        to: email,
        subject: "Booking Confirmation",
        html: `
          <h2>Booking Confirmed!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Your drone service booking has been received.</p>
          <p><b>Date:</b> ${escapeHtml(date)}</p>
          <p><b>State:</b> ${escapeHtml(state)}</p>
          <p><b>District:</b> ${escapeHtml(district)}</p>
          <p><b>Pin Code:</b> ${escapeHtml(pinCode)}</p>
          <p><b>Fields (Acres):</b> ${escapeHtml(acres)}</p>
          <p><b>Crop Type:</b> ${escapeHtml(cropType)}</p>
          <br/>
          <p>We'll contact you soon.</p>
        `,
      }),

      transporter.sendMail({
        from: formatFromAddress(),
        to: process.env.ADMIN_EMAIL,
        subject: "New Booking Received",
        html: `
          <h2>New Booking</h2>
          <p><b>Name:</b> ${escapeHtml(name)}</p>
          <p><b>Email:</b> ${escapeHtml(email)}</p>
          <p><b>Phone:</b> ${escapeHtml(phone)}</p>
          <p><b>State:</b> ${escapeHtml(state)}</p>
          <p><b>District:</b> ${escapeHtml(district)}</p>
          <p><b>Pin Code:</b> ${escapeHtml(pinCode)}</p>
          <p><b>Fields (Acres):</b> ${escapeHtml(acres)}</p>
          <p><b>Crop Type:</b> ${escapeHtml(cropType)}</p>
          <p><b>Date:</b> ${escapeHtml(date)}</p>
        `,
      }),
    ]);

    results
      .filter((r) => r.status === "rejected")
      .forEach((r) =>
        console.error("❌ Email delivery failure:", r.reason)
      );
  } catch (err) {
    console.error("❌ Email Error:", err);
  }
};

const sendStatusChangeEmail = async ({ name, email, status }) => {
  try {
    let subject = "Drone Service Update";
    let message = "";

    if (status === "Accept") {
      subject = "Booking Accepted!";
      message =
        "Great news! We have accepted your drone service booking and will contact you shortly.";
    } else if (status === "Reject") {
      message =
        "Unfortunately, we cannot fulfill your booking at this time.";
    } else if (status === "Completed") {
      subject = "Service Completed!";
      message =
        "Your drone service has been completed. Thank you for choosing Drriftaire!";
    } else {
      return;
    }

    await transporter.sendMail({
      from: formatFromAddress(),
      to: email,
      subject,
      html: `
        <h2>${escapeHtml(subject)}</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>${escapeHtml(message)}</p>
        <br/>
        <p>Best Regards,</p>
        <p>The Drriftaire Team</p>
      `,
    });
  } catch (err) {
    console.error("❌ Status Email Error:", err);
  }
};

const sendDuplicateBookingEmail = async ({ name, email }) => {
  try {
    await transporter.sendMail({
      from: formatFromAddress(),
      to: email,
      subject: "Booking Already Pending",
      html: `
        <h2>Hang tight!</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>You already have a booking marked as <b>Pending</b>.</p>
        <p>Our team will contact you soon!</p>
        <br/>
        <p>Best Regards,</p>
        <p>The Drriftaire Team</p>
      `,
    });
  } catch (err) {
    console.error("❌ Duplicate Email Error:", err);
  }
};

module.exports = {
  sendBookingEmails,
  sendStatusChangeEmail,
  sendDuplicateBookingEmail,
};