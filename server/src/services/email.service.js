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
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
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
  `"Drriftaire" <drriftaire@gmail.com>`;

const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = phone.toString().trim().replace(/\s+/g, '');
  if (cleaned.startsWith("+91")) return cleaned;
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  return `+91 ${cleaned}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const sendMailWithLogging = async ({ label, to, subject, html }) => {
  logEmail(`${label} attempt`, { to, subject });

  try {
    const fromAddr = formatFromAddress();
    const result = await transporter.sendMail({
      from: fromAddr,
      to,
      subject,
      html,
    });

    logEmail(`${label} response`, {
      to,
      messageId: result.messageId,
      response: result.response,
      envelope: result.envelope,
      accepted: result.accepted,
    });

    return result;
  } catch (error) {
    console.error(`[email] ${label} critical error`, serializeError(error));
    throw error;
  }
};

const THEME = {
  bg: "#ffffff",
  primary: "#1b4a36",
  text: "#243328",
  muted: "#6b7280",
  border: "#eeeeee",
};

const wrapTemplate = (title, preheader, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f7f6; color: #374151; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 60px 20px; }
    .header { margin-bottom: 40px; text-align: center; }
    .logo-text { font-size: 32px; font-weight: 800; color: #1b4a36; letter-spacing: -0.02em; text-transform: uppercase; }
    .card { background-color: #ffffff; border-radius: 40px; padding: 48px; border: 1px solid #e5e7eb; position: relative; }
    .title { font-size: 32px; font-weight: 700; color: #1b4a36; margin: 0 0 24px; line-height: 1.2; text-align: center; }
    .status-container { text-align: center; margin-bottom: 32px; }
    .status-badge { display: inline-block; padding: 8px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
    .status-badge.accepted { background-color: #dcfce7; color: #1b4a36; }
    .status-badge.pending { background-color: #fef3c7; color: #92400e; }
    .status-badge.completed { background-color: #dbeafe; color: #1e40af; }
    .status-badge.rejected { background-color: #fee2e2; color: #991b1b; }
    .content { font-size: 17px; line-height: 1.7; color: #374151; text-align: left; }
    .data-grid { background-color: #f9f9f9; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb; }
    .data-label { color: #6b7280; font-size: 13px; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
    .data-value { color: #111827; font-weight: 700; font-size: 16px; }
    .footer { margin-top: 48px; text-align: center; color: #6b7280; font-size: 13px; line-height: 1.8; }
    .btn { display: inline-block; padding: 16px 32px; background-color: #1b4a36; color: #ffffff !important; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 16px; transition: opacity 0.2s; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">DRRIFTAIRE</div>
    </div>
    <div class="card">
      <div class="title">${title}</div>
      <div class="content">
        ${content}
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Drriftaire Drone Bookings.<br/>
      Technology-driven crop care for sustainable farming.
    </div>
  </div>
</body>
</html>
`;

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
    const formattedPhone = formatPhoneNumber(phone);
    const dataItems = [
      { label: "Date", value: formatDate(date) },
      { label: "Location", value: `${district}, ${state}` },
      { label: "Pin Code", value: pinCode },
      { label: "Acreage", value: `${acres} Acres` },
      { label: "Crop Type", value: cropType },
    ];

    const customerItems = [
      { label: "Customer", value: name },
      { label: "Contact", value: `${email} | ${formattedPhone}` },
    ];

    const dataHtml = `
      <div class="data-grid">
        ${dataItems.map(item => `
          <div style="margin-bottom: 12px;">
            <div class="data-label">${escapeHtml(item.label)}</div>
            <div class="data-value">${escapeHtml(item.value)}</div>
          </div>
        `).join('')}
      </div>
    `;

    const adminDataHtml = `
      <div class="data-grid">
        ${[...customerItems, ...dataItems].map(item => `
          <div style="margin-bottom: 12px;">
            <div class="data-label">${escapeHtml(item.label)}</div>
            <div class="data-value">${escapeHtml(item.value)}</div>
          </div>
        `).join('')}
      </div>
    `;

    logEmail("sendBookingEmails building items", { email });

    const results = await Promise.allSettled([
      ...(email ? [sendMailWithLogging({
        label: "booking confirmation",
        to: email,
        subject: "Your Drone Spraying Booking",
        html: wrapTemplate(
          "Booking Received",
          "We've received your booking.",
          `
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thank you for choosing Drriftaire. We have successfully received your booking request for drone spraying.</p>
            ${dataHtml}
            <p>Our operational team will review the details and contact you shortly at <strong>${escapeHtml(formattedPhone)}</strong> to confirm scheduling. No further action is required from your side at this moment.</p>
          `
        ),
      })] : []),
      sendMailWithLogging({
        label: "admin booking notification",
        to: process.env.ADMIN_EMAIL,
        subject: `New Booking from ${name}`,
        html: wrapTemplate(
          "New Booking!",
          "A new customer has submitted an inquiry.",
          `
            ${adminDataHtml}
            <p style="text-align: center;">
              <a href="https://drriftaire.com/admin" class="btn">OPEN MANAGEMENT PANEL</a>
            </p>
          `
        ),
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

  if (!email) {
    logEmail("sendStatusChangeEmail skipped: no email", { status });
    return;
  }

  try {
    let subject = "Status Update: Your Drone Booking";
    let title = "Booking Update";
    let message = "";
    let statusClass = "pending";
    let activeStatus = status;

    if (status === "Accept") {
      subject = "Booking Accepted - Drriftaire";
      title = "Booking Confirmed!";
      message = "Your booking has been officially <strong>Accepted</strong>. Our crew is now preparing for the operation on the scheduled date.";
      statusClass = "accepted";
      activeStatus = "Accepted";
    } else if (status === "Reject") {
      subject = "Update on Booking!";
      title = "Update on Booking!";
      message = "Thank you for reaching out. Unfortunately, we are unable to fulfill your specific booking request at this time.";
      statusClass = "rejected";
      activeStatus = "Rejected";
    } else if (status === "Completed") {
      subject = "Booking Completed - Drriftaire";
      title = "Service Completed!";
      message = "Your drone spraying booking has been successfully <strong>Completed</strong>. We hope you are satisfied with the precision and results.";
      statusClass = "completed";
      activeStatus = "Completed";
    } else {
      logEmail("sendStatusChangeEmail skipped", { email, status });
      return;
    }

    await sendMailWithLogging({
      label: `status change ${status.toLowerCase()}`,
      to: email,
      subject,
      html: wrapTemplate(
        title,
        activeStatus,
        `
          <div class="status-container">
            <span class="status-badge ${statusClass}">${activeStatus}</span>
          </div>
          <p>Hi ${escapeHtml(name)},</p>
          <p>${message}</p>
          <p>If you have any questions, feel free to reply to this email.</p>
        `
      ),
    });
  } catch (err) {
    console.error("[email] sendStatusChangeEmail crashed", serializeError(err));
  }
};

const sendDuplicateBookingEmail = async ({ name, email }) => {
  logEmail("sendDuplicateBookingEmail start", { email });

  if (!email) {
    logEmail("sendDuplicateBookingEmail skipped: no email");
    return;
  }

  try {
    await sendMailWithLogging({
      label: "duplicate booking reminder",
      to: email,
      subject: "Request in Progress",
      html: wrapTemplate(
        "Hang Tight!",
        "Double request detected",
        `
          <p>Hi ${escapeHtml(name)},</p>
          <p>It looks like you've already submitted a request that is currently marked as <strong>Pending</strong>.</p>
          <p>Our team is currently reviewing your previous inquiry and will reach out shortly. There's no need to resubmit!</p>
        `
      ),
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
