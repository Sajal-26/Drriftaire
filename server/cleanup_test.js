require('dotenv').config();
const { getAllBookings, updateBookingStatus } = require('./src/services/sheets.service');

async function cleanup() {
    try {
        const email = "sajal.chitlangia2602@gmail.com";
        const bookings = await getAllBookings();
        const pending = bookings.filter(b => b.Email === email && (!b.Status || b.Status.toLowerCase() === "pending"));
        for (const b of pending) {
            console.log(`Cleaning up pending booking ID ${b.id} for ${email}`);
            await updateBookingStatus(b.id, "Completed", "Automated Clean");
        }
        console.log("Cleanup done.");
    } catch (e) {
        console.error(e);
    }
}
cleanup();
