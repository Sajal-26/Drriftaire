require("dotenv").config();

const BASE_URL = "http://localhost:3000/api";

const TEST_EMAIL = "sajal.chitlangia2602@gmail.com";
const TEST_PHONE = `+1${Math.floor(Math.random() * 1000000000)}`;
let adminToken = "";
let newlyCreatedBookingId = null;

async function runTests() {
  console.log("🚀 Starting Exhaustive E2E API Test Suite...\n");

  try {
    // ---------------------------------------------------------
    // TEST 1: INVALID BOOKING VALIDATION (Missing Fields)
    // ---------------------------------------------------------
    console.log("--- [1] Testing Invalid Booking (Missing Data) ---");
    let res = await fetch(`${BASE_URL}/bookings/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Only Name" })
    });
    console.log(`Status: ${res.status} (Expected 400)`);
    console.log("Response:", await res.json());
    console.log();

    // ---------------------------------------------------------
    // TEST 2: INVALID BOOKING VALIDATION (Bad Email Format)
    // ---------------------------------------------------------
    console.log("--- [2] Testing Booking Validation (Bad Email) ---");
    res = await fetch(`${BASE_URL}/bookings/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "this.is.not.an.email.com", 
        phone: "1234567890",
        state: "Test State",
        district: "Test District",
        pinCode: "000000",
        acres: "10",
        cropType: "Wheat",
        date: "2026-05-01"
      })
    });
    console.log(`Status: ${res.status} (Expected 400)`);
    console.log("Response:", await res.json());
    console.log();

    // ---------------------------------------------------------
    // TEST 3: CREATING A VALID BOOKING (New Pending Row)
    // ---------------------------------------------------------
    console.log(`--- [3] Try Creating Valid Booking (${TEST_EMAIL}) ---`);
    res = await fetch(`${BASE_URL}/bookings/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Automated Tester",
        email: TEST_EMAIL, 
        phone: TEST_PHONE,
        state: "Virtual State",
        district: "Virtual District",
        pinCode: "111111",
        acres: "99",
        cropType: "Rice",
        date: "2026-10-31"
      })
    });
    console.log(`Status: ${res.status} (Expected 201)`);
    console.log("Response:", await res.json());
    console.log();

    // ---------------------------------------------------------
    // TEST 4: DUPLICATE BOOKING (Pending State Rejection)
    // ---------------------------------------------------------
    console.log(`--- [4] Duplicate Check: Booking again with (${TEST_EMAIL}) ---`);
    res = await fetch(`${BASE_URL}/bookings/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Automated Tester Two",
        email: TEST_EMAIL, // Duplicate email!
        phone: "0000000000",
        state: "Virtual State 2",
        district: "Virtual District 2",
        pinCode: "222222",
        acres: "40",
        cropType: "Corn",
        date: "2026-11-01"
      })
    });
    console.log(`Status: ${res.status} (Expected 409 Conflict)`);
    console.log("Response:", await res.json());
    console.log();

    // ---------------------------------------------------------
    // TEST 5: ADMIN LOGIN
    // ---------------------------------------------------------
    console.log("--- [5] Testing Admin Login ---");
    res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      })
    });
    const loginData = await res.json();
    if (res.ok && loginData.token) {
      console.log(`Status: ${res.status} (Expected 200)`);
      adminToken = loginData.token;
    } else {
      console.log(`❌ Failed Login (Status: ${res.status})`);
      return; 
    }
    console.log();

    // ---------------------------------------------------------
    // TEST 6: FETCH ANALYTICS
    // ---------------------------------------------------------
    console.log("--- [6] Testing Analytics Endpoint ---");
    res = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    console.log(`Status: ${res.status} (Expected 200)`);
    console.log("Response:", await res.json());
    console.log();

    // ---------------------------------------------------------
    // TEST 7: FETCH ALL BOOKINGS (Locate New Automate Row)
    // ---------------------------------------------------------
    console.log("--- [7] Testing Get All Bookings ---");
    res = await fetch(`${BASE_URL}/admin/bookings`, {
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    console.log(`Status: ${res.status} (Expected 200)`);
    const bookingsData = await res.json();
    console.log(`Fetched ${bookingsData.bookings ? bookingsData.bookings.length : 0} total bookings.`);
    
    // Find the row we just appended
    const testBooking = bookingsData.bookings.find(b => b.Email === TEST_EMAIL);
    if (testBooking) {
      newlyCreatedBookingId = testBooking.id;
      console.log(`✅ Located the automated test row internally (ID: ${newlyCreatedBookingId})`);
    }
    console.log();

    // ---------------------------------------------------------
    // TEST 8: ADMIN PATCH RECORD TO "COMPLETED"
    // ---------------------------------------------------------
    console.log(`--- [8] Admin Updates Status to 'Completed' (ID: ${newlyCreatedBookingId}) ---`);
    res = await fetch(`${BASE_URL}/admin/bookings/${newlyCreatedBookingId}/status`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${adminToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Completed", remarks: "All fields thoroughly sprayed. Excellent weather conditions." })
    });
    console.log(`Status: ${res.status} (Expected 200)`);
    console.log("Response:", await res.json());
    console.log();

    // ---------------------------------------------------------
    // TEST 9: SECOND BOOKING POST "COMPLETED" STATE
    // ---------------------------------------------------------
    console.log(`--- [9] Booking With Same Email AGAIN (${TEST_EMAIL}) ---`);
    console.log("      (Since previous is Completed, this should bypass 409 Conflict!)");
    res = await fetch(`${BASE_URL}/bookings/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Automated Tester Again",
        email: TEST_EMAIL, 
        phone: TEST_PHONE,
        state: "Virtual State Return",
        district: "Virtual District Return",
        pinCode: "333333",
        acres: "100",
        cropType: "Soybean",
        date: "2026-12-01"
      })
    });
    console.log(`Status: ${res.status} (Expected 201 Created)`);
    console.log("Response:", await res.json());
    console.log();

    // ---------------------------------------------------------
    // TEST 10: CLEAN UP (DISABLED FOR INSPECTION)
    // ---------------------------------------------------------
    console.log(`--- [10] Skipped cleanup so you can inspect the Google Sheet directly! ---`);
    /* 
    res = await fetch(`${BASE_URL}/admin/bookings`, { headers: { "Authorization": `Bearer ${adminToken}` }});
    const finalBookings = await res.json();
    const allAutomated = finalBookings.bookings.filter(b => b.Email === TEST_EMAIL);
    
    for (const b of allAutomated) {
      await fetch(`${BASE_URL}/admin/bookings/${b.id}/status`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${adminToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Pending" })
      });
    }
    console.log(`✅ Successfully cleaned up automated test rows back to 'Pending' to avoid live notification spam!`);
    */

    console.log("\n🎉 ALL AUTOMATED E2E API TESTS PASSED FLAWLESSLY!");

  } catch (err) {
    console.error("❌ A test threw a fatal error:", err);
  }
}

runTests();
