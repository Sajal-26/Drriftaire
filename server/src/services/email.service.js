const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmails = async ({ name, email, phone, location, farmSize, date }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmation",
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Your drone service booking has been received.</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Farm Size:</b> ${farmSize}</p>
        <br/>
        <p>We'll contact you soon.</p>
      `,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Booking Received",
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Farm Size:</b> ${farmSize}</p>
        <p><b>Date:</b> ${date}</p>
      `,
    });

  } catch (err) {
    console.error("Email Error:", err);
  }
};

module.exports = { sendBookingEmails };