require('dotenv').config();
const { getAllBookings } = require('./src/services/sheets.service');

async function check() {
    try {
        const bookings = await getAllBookings();
        console.log("ID".padEnd(5), "Status".padEnd(12), "Email".padEnd(30), "Phone");
        bookings.forEach(b => {
             console.log(String(b.id).padEnd(5), String(b.Status).padEnd(12), String(b.Email).padEnd(30), b.Phone);
        });
    } catch (e) {
        console.error(e);
    }
}
check();
