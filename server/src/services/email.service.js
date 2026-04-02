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

const THEME = {
  bg: "#f6f4ee",
  card: "#ffffff",
  primary: "#1b4a36",
  accent: "#2f6a47",
  text: "#243328",
  muted: "#60796d",
  border: "rgba(47, 106, 71, 0.1)",
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
    body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: ${THEME.bg}; color: ${THEME.text}; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background-color: ${THEME.card}; border-radius: 24px; padding: 40px; border: 1px solid ${THEME.border}; box-shadow: 0 10px 30px -10px rgba(27, 74, 54, 0.12); }
    .header { margin-bottom: 32px; text-align: center; }
    .logo-text { font-size: 24px; font-weight: 800; color: ${THEME.primary}; letter-spacing: -0.02em; }
    .title { font-size: 28px; font-weight: 700; color: ${THEME.primary}; margin: 24px 0 16px; line-height: 1.2; text-align: center; }
    .content { font-size: 16px; line-height: 1.6; color: ${THEME.text}; }
    .data-grid { background-color: ${THEME.bg}; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid ${THEME.border}; }
    .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(27, 74, 54, 0.05); }
    .data-row:last-child { border-bottom: none; }
    .data-label { color: ${THEME.muted}; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .data-value { color: ${THEME.primary}; font-weight: 700; font-size: 15px; }
    .footer { margin-top: 32px; text-align: center; color: ${THEME.muted}; font-size: 13px; line-height: 1.5; }
    .btn { display: inline-block; padding: 14px 28px; background-color: ${THEME.accent}; color: #ffffff !important; border-radius: 99px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 16px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge-pending { background-color: #fef3c7; color: #92400e; }
    .badge-accepted { background-color: #d1fae5; color: #065f46; }
    .badge-completed { background-color: #e0e7ff; color: #3730a3; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">DRIFTAIRE</div>
    </div>
    <div class="card">
      <div class="title">${title}</div>
      <div class="content">
        ${content}
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Drriftaire Drone Services.<br/>
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
    const dataItems = [
      { label: "Date", value: date },
      { label: "Location", value: `${district}, ${state}` },
      { label: "Pin Code", value: pinCode },
      { label: "Acreage", value: `${acres} Acres` },
      { label: "Crop Type", value: cropType },
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

    const results = await Promise.allSettled([
      sendMailWithLogging({
        label: "booking confirmation",
        to: email,
        subject: "Your Drone Spraying Request",
        html: wrapTemplate(
          "Request Received",
          "We've received your booking request.",
          `
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thank you for choosing Drriftaire. We have successfully received your service request for drone spraying.</p>
            ${dataHtml}
            <p>Our operational team will review the details and contact you shortly at <strong>${escapeHtml(phone)}</strong> to confirm scheduling. No further action is required from your side at this moment.</p>
          `
        ),
      }),
      sendMailWithLogging({
        label: "admin booking notification",
        to: process.env.ADMIN_EMAIL,
        subject: `New Request from ${name}`,
        html: wrapTemplate(
          "New Service Request",
          "A new customer has submitted an inquiry.",
          `
            <p><strong>Customer:</strong> ${escapeHtml(name)}</p>
            <p><strong>Contact:</strong> ${escapeHtml(email)} | ${escapeHtml(phone)}</p>
            ${dataHtml}
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

  try {
    let subject = "Status Update: Your Drone Service";
    let title = "Booking Update";
    let message = "";
    let badgeClass = "badge-pending";

    if (status === "Accept") {
      subject = "Booking Accepted - Drriftaire";
      title = "Confirmed!";
      message = "Your request has been officially <strong>Accepted</strong>. Our crew is now preparing for the operation on the scheduled date.";
      badgeClass = "badge-accepted";
    } else if (status === "Reject") {
      title = "Update on Request";
      message = "Thank you for reaching out. Unfortunately, we are unable to fulfill your specific booking request at this time.";
    } else if (status === "Completed") {
      subject = "Service Finalized - Drriftaire";
      title = "Mission Completed!";
      message = "Your drone spraying service has been successfully <strong>Completed</strong>. We hope you are satisfied with the precision and results.";
      badgeClass = "badge-completed";
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
        status,
        `
          <div style="text-align: center; margin-bottom: 24px;">
            <span class="badge ${badgeClass}">${status}</span>
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
