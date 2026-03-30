const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmails = async ({ name, email, phone, state, district, pinCode, acres, cropType, date }) => {
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
        <p><b>State:</b> ${state}</p>
        <p><b>District:</b> ${district}</p>
        <p><b>Pin Code:</b> ${pinCode}</p>
        <p><b>Fields (Acres):</b> ${acres}</p>
        <p><b>Crop Type:</b> ${cropType}</p>
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
        <p><b>State:</b> ${state}</p>
        <p><b>District:</b> ${district}</p>
        <p><b>Pin Code:</b> ${pinCode}</p>
        <p><b>Fields (Acres):</b> ${acres}</p>
        <p><b>Crop Type:</b> ${cropType}</p>
        <p><b>Date:</b> ${date}</p>
      `,
    });

  } catch (err) {
    console.error("Email Error:", err);
  }
};
const sendStatusChangeEmail = async ({ name, email, status }) => {
  try {
    let subject = "Drone Service Update";
    let message = "";

    if (status === "Accept") {
      subject = "Booking Accepted! 🎉";
      message = "Great news! We have accepted your drone service booking and will be in touch shortly to finalize the details.";
    } else if (status === "Reject") {
      subject = "Booking Update";
      message = "Unfortunately, we are unable to fulfill your drone service booking at this time. Please contact us if you have any questions.";
    } else if (status === "Completed") {
      subject = "Service Completed! ✅";
      message = "Your drone service has been marked as completed. Thank you for choosing Drriftaire!";
    } else {
      return; 
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <h2>${subject}</h2>
        <p>Hi ${name},</p>
        <p>${message}</p>
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
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Already Pending",
      html: `
        <h2>Hang tight!</h2>
        <p>Hi ${name},</p>
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