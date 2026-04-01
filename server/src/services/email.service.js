const nodemailer = require("nodemailer");

const serializeError = (error) => {
  if (!error) {
    return null;
  }

  return {
    message: error.message,
    code: error.code,
    command: error.command,
    response: error.response,
    responseCode: error.responseCode,
    errno: error.errno,
    syscall: error.syscall,
    address: error.address,
    port: error.port,
    stack: error.stack,
  };
};

const logEmail = (step, details = {}) => {
  console.log(`[email] ${step}`, details);
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) {
    console.error("[email] transporter.verify failed", serializeError(err));
  } else {
    logEmail("transporter.verify success", { success: Boolean(success) });
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

const sendMailWithLogging = async ({ label, to, subject, html }) => {
  logEmail(`${label} queued`, { to, subject });

  try {
    const result = await transporter.sendMail({
      from: formatFromAddress(),
      to,
      subject,
      html,
    });

    logEmail(`${label} sent`, {
      to,
      subject,
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    });

    return result;
  } catch (error) {
    console.error(`[email] ${label} failed`, serializeError(error));
    throw error;
  }
};

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
  logEmail("sendBookingEmails start", {
    email,
    adminEmail: process.env.ADMIN_EMAIL,
    date,
    district,
    state,
  });

  try {
    const results = await Promise.allSettled([
      sendMailWithLogging({
        label: "booking confirmation",
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
      sendMailWithLogging({
        label: "admin booking notification",
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

    logEmail("sendBookingEmails settled", {
      results: results.map((result, index) => ({
        target: index === 0 ? "customer" : "admin",
        status: result.status,
        reason: result.status === "rejected" ? serializeError(result.reason) : null,
      })),
    });
  } catch (err) {
    console.error("[email] sendBookingEmails crashed", serializeError(err));
  }
};

const sendStatusChangeEmail = async ({ name, email, status }) => {
  logEmail("sendStatusChangeEmail start", { email, status });

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
      logEmail("sendStatusChangeEmail skipped", { email, status });
      return;
    }

    await sendMailWithLogging({
      label: `status change ${status.toLowerCase()}`,
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
    console.error("[email] sendStatusChangeEmail crashed", serializeError(err));
  }
};

const sendDuplicateBookingEmail = async ({ name, email }) => {
  logEmail("sendDuplicateBookingEmail start", { email });

  try {
    await sendMailWithLogging({
      label: "duplicate booking reminder",
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
    console.error("[email] sendDuplicateBookingEmail crashed", serializeError(err));
  }
};

module.exports = {
  sendBookingEmails,
  sendStatusChangeEmail,
  sendDuplicateBookingEmail,
};
