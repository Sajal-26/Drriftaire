const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { getAllBookings, updateBookingStatus } = require("../services/supabase.service");
const { sendStatusChangeEmail } = require("../services/email.service");

const verifyPassword = (password) => {
  const rawPassword = typeof password === "string" ? password : "";
  const hashedSecret = process.env.ADMIN_PASSWORD_HASH;

  if (hashedSecret) {
    const [salt, storedHash] = hashedSecret.split(":");

    if (!salt || !storedHash) {
      throw new Error("ADMIN_PASSWORD_HASH must use the format salt:hash");
    }

    const derivedKey = crypto.scryptSync(rawPassword, salt, 64).toString("hex");
    const derivedBuffer = Buffer.from(derivedKey, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (derivedBuffer.length !== storedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedBuffer, storedBuffer);
  }

  const legacyPassword = process.env.ADMIN_PASSWORD || "";
  const passwordBuffer = Buffer.from(rawPassword);
  const legacyBuffer = Buffer.from(legacyPassword);

  if (passwordBuffer.length !== legacyBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(passwordBuffer, legacyBuffer);
};

const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const isAdminEmail = email.trim().toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
  const isValidPassword = verifyPassword(password);

  if (isAdminEmail && isValidPassword) {
    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.json({ token, message: "Admin login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

const changeBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, sales, profit } = req.body;

    const validStatuses = ["Pending", "Accept", "Reject", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const sanitizedRemarks = typeof remarks === "string" ? remarks.trim().slice(0, 500) : undefined;
    const updatedRow = await updateBookingStatus(id, status, sanitizedRemarks, sales, profit);

    if (updatedRow) {
      if (status !== "Pending") {
        await sendStatusChangeEmail({
          email: updatedRow.Email,
          name: updatedRow.Name,
          status: status
        });
      }
      res.json({ message: `Booking ${id} status successfully updated to ${status}` });
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    
    const analytics = {
      total: bookings.length,
      pending: 0,
      accept: 0,
      reject: 0,
      completed: 0,
      totalSales: 0,
      totalProfit: 0
    };

    bookings.forEach(b => {
      const stat = b.Status ? b.Status.toLowerCase() : 'pending';
      if (analytics[stat] !== undefined) {
        analytics[stat]++;
      }
      analytics.totalSales += Number(b.Sales) || 0;
      analytics.totalProfit += Number(b.Profit) || 0;
    });

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

module.exports = { adminLogin, getBookings, changeBookingStatus, getAnalytics };
