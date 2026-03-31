const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      family: 4,
      dnsTimeout: 5000, 
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      tls: {
        servername: "smtp.gmail.com",
        rejectUnauthorized: true, 
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 5000,
    });
  }
  return transporter;
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const formatFromAddress = () => `"Drriftaire" <${process.env.EMAIL_USER}>`;

const sendBookingEmails = async ({ name, email, phone, state, district, pinCode, acres, cropType, date }) => {
  try {
    const mailer = getTransporter();
    const results = await Promise.allSettled([
      mailer.sendMail({
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
      mailer.sendMail({
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
      .filter((result) => result.status === "rejected")
      .forEach((result) => console.error("Email delivery failure:", result.reason));
  } catch (err) {
    console.error("Email Error:", err);
  }
};

const sendStatusChangeEmail = async ({ name, email, status }) => {
  try {
    let subject = "Drone Service Update";
    let message = "";

    if (status === "Accept") {
      subject = "Booking Accepted!";
      message = "Great news! We have accepted your drone service booking and will be in touch shortly to finalize the details.";
    } else if (status === "Reject") {
      subject = "Booking Update";
      message = "Unfortunately, we are unable to fulfill your drone service booking at this time. Please contact us if you have any questions.";
    } else if (status === "Completed") {
      subject = "Service Completed!";
      message = "Your drone service has been marked as completed. Thank you for choosing Drriftaire!";
    } else {
      return;
    }

    await getTransporter().sendMail({
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
    console.error("Status Email Error:", err);
  }
};

const sendDuplicateBookingEmail = async ({ name, email }) => {
  try {
    await getTransporter().sendMail({
      from: formatFromAddress(),
      to: email,
      subject: "Booking Already Pending",
      html: `
        <h2>Hang tight!</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>We noticed you tried to make another booking, but your previous drone service slot is currently still <b>Pending</b>.</p>
        <p>Our team will contact you very soon to finalize the details of your original request!</p>
        <br/>
        <p>Best Regards,</p>
        <p>The Drriftaire Team</p>
      `,
    });
  } catch (err) {
    console.error("Duplicate Email Error:", err);
  }
};

module.exports = { sendBookingEmails, sendStatusChangeEmail, sendDuplicateBookingEmail };
