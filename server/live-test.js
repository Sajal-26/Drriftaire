require("dotenv").config();

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: process.env.LIVE_TEST_BASE_URL || "http://localhost:5000",
    adminEmail: process.env.LIVE_TEST_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "",
    adminPassword: process.env.LIVE_TEST_ADMIN_PASSWORD || "",
    includeWrites: true,
    includeAdminMutations: true,
    includeRateLimit: false,
    logFile: "",
  };

  args.forEach((arg) => {
    if (arg === "--include-writes") {
      options.includeWrites = true;
      return;
    }

    if (arg === "--skip-writes") {
      options.includeWrites = false;
      options.includeAdminMutations = false;
      return;
    }

    if (arg === "--include-admin-mutations") {
      options.includeAdminMutations = true;
      return;
    }

    if (arg === "--skip-admin-mutations") {
      options.includeAdminMutations = false;
      return;
    }

    if (arg === "--include-rate-limit") {
      options.includeRateLimit = true;
      return;
    }

    const [key, value] = arg.split("=");
    if (!value) {
      return;
    }

    if (key === "--base-url") {
      options.baseUrl = value.replace(/\/+$/, "");
    } else if (key === "--admin-email") {
      options.adminEmail = value;
    } else if (key === "--admin-password") {
      options.adminPassword = value;
    } else if (key === "--log-file") {
      options.logFile = value;
    }
  });

  return options;
};

const options = parseArgs();
let requestCounter = 0;
const runId = `live-${Date.now()}`;
const logDir = path.join(__dirname, "logs");
const logFile = options.logFile || path.join(logDir, `${runId}.log`);

fs.mkdirSync(path.dirname(logFile), { recursive: true });
fs.writeFileSync(logFile, "");

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

const writeLog = (message) => {
  const line = `[${new Date().toISOString()}] ${message}`;
  fs.appendFileSync(logFile, `${line}\n`);
};

const print = {
  pass: (message) => {
    console.log(`${colors.green}PASS${colors.reset} ${message}`);
    writeLog(`PASS ${message}`);
  },
  fail: (message) => {
    console.error(`${colors.red}FAIL${colors.reset} ${message}`);
    writeLog(`FAIL ${message}`);
  },
  info: (message) => {
    console.log(`${colors.yellow}INFO${colors.reset} ${message}`);
    writeLog(`INFO ${message}`);
  },
};

const createUserToken = () => jwt.sign(
  { email: "user@example.com", role: "user" },
  process.env.JWT_SECRET,
  { expiresIn: "12h" }
);

const makeFutureDate = (daysAhead = 3) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
};

const makeBookingPayload = (suffix, overrides = {}) => ({
  name: `Live Test ${suffix}`,
  email: `${runId}-${suffix}@example.com`,
  phone: `9${String(Date.now() + suffix.length).slice(-9)}`,
  state: "West Bengal",
  district: "Kolkata",
  pinCode: "700001",
  acres: 3,
  cropType: "Rice",
  date: makeFutureDate(),
  ...overrides,
});

const requireAdminToken = (context) => {
  if (!context.adminToken) {
    throw new Error("Missing admin session token. Pass --admin-password=... or set LIVE_TEST_ADMIN_PASSWORD.");
  }

  return context.adminToken;
};

const requestJson = async (pathName, config = {}) => {
  requestCounter += 1;
  const testIp = config.testIp || `203.0.113.${(requestCounter % 200) + 1}`;
  const startedAt = Date.now();

  writeLog(`REQUEST ${config.method || "GET"} ${pathName} ip=${testIp} body=${JSON.stringify(config.body || {})}`);

  const response = await fetch(`${options.baseUrl}${pathName}`, {
    method: config.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": testIp,
      ...(config.headers || {}),
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  writeLog(`RESPONSE ${config.method || "GET"} ${pathName} status=${response.status} duration_ms=${Date.now() - startedAt} body=${JSON.stringify(body)}`);

  return { response, body };
};

const expectStatus = async (name, promise, expectedStatuses) => {
  const { response, body } = await promise;
  const statuses = Array.isArray(expectedStatuses) ? expectedStatuses : [expectedStatuses];

  if (!statuses.includes(response.status)) {
    throw new Error(`${name} expected status ${statuses.join(" or ")}, got ${response.status}. Body: ${JSON.stringify(body)}`);
  }

  return { response, body };
};

const expectEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}`);
  }
};

const expectAtLeast = (actual, expected, message) => {
  if (actual < expected) {
    throw new Error(`${message}. Expected at least ${expected}, got ${actual}`);
  }
};

const tests = [];

const addTest = (name, run, optionsForTest = {}) => {
  tests.push({ name, run, ...optionsForTest });
};

const fetchAnalytics = async (context) => {
  const token = requireAdminToken(context);
  const { body } = await expectStatus(
    "admin analytics",
    requestJson("/api/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    200
  );

  return body;
};

const fetchBookings = async (context) => {
  const token = requireAdminToken(context);
  const { body } = await expectStatus(
    "admin bookings",
    requestJson("/api/admin/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    }),
    200
  );

  if (!Array.isArray(body.bookings)) {
    throw new Error("Admin bookings response did not include an array.");
  }

  return body.bookings;
};

const createBooking = async (label, payload) => {
  await expectStatus(
    `${label} create booking`,
    requestJson("/api/bookings/book", {
      method: "POST",
      body: payload,
    }),
    201
  );
};

const updateBookingStatus = async (context, bookingId, status, remarks) => {
  const token = requireAdminToken(context);
  await expectStatus(
    `admin update ${status}`,
    requestJson(`/api/admin/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { status, remarks },
    }),
    200
  );
};

addTest("GET /health returns 200", async () => {
  const { body } = await expectStatus("health", requestJson("/health"), 200);
  expectEqual(body.status, "ok", "Health status should be ok");
});

addTest("Unknown route returns 404", async () => {
  await expectStatus("404", requestJson("/does-not-exist"), 404);
});

addTest("POST /api/bookings/book rejects missing name", async () => {
  await expectStatus(
    "missing booking name",
    requestJson("/api/bookings/book", {
      method: "POST",
      body: makeBookingPayload("missing-name", { name: "" }),
    }),
    400
  );
});

addTest("POST /api/bookings/book rejects invalid email", async () => {
  await expectStatus(
    "invalid booking email",
    requestJson("/api/bookings/book", {
      method: "POST",
      body: makeBookingPayload("invalid-email", { email: "bad-email" }),
    }),
    400
  );
});

addTest("POST /api/bookings/book rejects invalid phone", async () => {
  await expectStatus(
    "invalid booking phone",
    requestJson("/api/bookings/book", {
      method: "POST",
      body: makeBookingPayload("invalid-phone", { phone: "1234" }),
    }),
    400
  );
});

addTest("POST /api/bookings/book rejects invalid pin code", async () => {
  await expectStatus(
    "invalid booking pin",
    requestJson("/api/bookings/book", {
      method: "POST",
      body: makeBookingPayload("invalid-pin", { pinCode: "12" }),
    }),
    400
  );
});

addTest("POST /api/bookings/book rejects invalid acres", async () => {
  await expectStatus(
    "invalid booking acres",
    requestJson("/api/bookings/book", {
      method: "POST",
      body: makeBookingPayload("invalid-acres", { acres: 0 }),
    }),
    400
  );
});

addTest("POST /api/bookings/book rejects past date", async () => {
  const date = new Date();
  date.setDate(date.getDate() - 2);

  await expectStatus(
    "past booking date",
    requestJson("/api/bookings/book", {
      method: "POST",
      body: makeBookingPayload("past-date", { date: date.toISOString().slice(0, 10) }),
    }),
    400
  );
});

addTest("POST /api/admin/login rejects missing credentials", async () => {
  await expectStatus(
    "admin login missing creds",
    requestJson("/api/admin/login", {
      method: "POST",
      body: { email: options.adminEmail },
    }),
    400
  );
});

addTest("POST /api/admin/login rejects invalid credentials", async () => {
  await expectStatus(
    "admin login invalid creds",
    requestJson("/api/admin/login", {
      method: "POST",
      testIp: "203.0.113.60",
      body: { email: options.adminEmail, password: "not-the-password" },
    }),
    401
  );
});

addTest("POST /api/admin/login succeeds with valid credentials", async (context) => {
  if (!options.adminPassword) {
    throw new Error("Missing admin password. Pass --admin-password=... or set LIVE_TEST_ADMIN_PASSWORD.");
  }

  const { body } = await expectStatus(
    "admin login valid creds",
    requestJson("/api/admin/login", {
      method: "POST",
      testIp: "203.0.113.61",
      body: { email: options.adminEmail, password: options.adminPassword },
    }),
    200
  );

  if (!body.token) {
    throw new Error("Admin login succeeded but no token was returned.");
  }

  context.adminToken = body.token;
});

addTest("GET /api/admin/bookings requires token", async () => {
  await expectStatus("admin bookings without token", requestJson("/api/admin/bookings"), 401);
});

addTest("GET /api/admin/bookings rejects invalid token", async () => {
  await expectStatus(
    "admin bookings invalid token",
    requestJson("/api/admin/bookings", {
      headers: { Authorization: "Bearer not-a-real-token" },
    }),
    403
  );
});

addTest("GET /api/admin/bookings rejects non-admin token", async () => {
  await expectStatus(
    "admin bookings non-admin token",
    requestJson("/api/admin/bookings", {
      headers: { Authorization: `Bearer ${createUserToken()}` },
    }),
    403
  );
});

addTest("GET /api/admin/bookings returns booking data", async (context) => {
  const bookings = await fetchBookings(context);
  expectAtLeast(bookings.length, 0, "Bookings array should exist");
});

addTest("GET /api/admin/analytics returns analytics", async (context) => {
  const analytics = await fetchAnalytics(context);

  ["total", "pending", "accept", "reject", "completed"].forEach((key) => {
    if (typeof analytics[key] !== "number") {
      throw new Error(`Analytics response missing numeric key: ${key}`);
    }
  });

  context.analyticsBaseline = analytics;
});

addTest("PATCH /api/admin/bookings/:id/status rejects invalid status", async (context) => {
  const token = requireAdminToken(context);
  await expectStatus(
    "admin invalid status",
    requestJson("/api/admin/bookings/999999/status", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { status: "Archived" },
    }),
    400
  );
});

addTest("PATCH /api/admin/bookings/:id/status returns 404 for missing booking", async (context) => {
  const token = requireAdminToken(context);
  await expectStatus(
    "admin update missing booking",
    requestJson("/api/admin/bookings/999999/status", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { status: "Accept" },
    }),
    404
  );
});

addTest(
  "Creates three live bookings for Pending, Reject, and Completed scenarios",
  async (context) => {
    const bookings = {
      pending: makeBookingPayload("pending"),
      reject: makeBookingPayload("reject"),
      complete: makeBookingPayload("complete"),
    };

    await createBooking("pending booking", bookings.pending);
    await createBooking("reject booking", bookings.reject);
    await createBooking("complete booking", bookings.complete);

    context.liveBookings = bookings;

    const fetchedBookings = await fetchBookings(context);
    const ids = {};

    Object.entries(bookings).forEach(([key, payload]) => {
      const match = fetchedBookings.find((booking) => booking.Email === payload.email);
      if (!match) {
        throw new Error(`Could not find created booking for ${payload.email} in admin bookings.`);
      }
      ids[key] = match.id;
    });

    context.liveBookingIds = ids;

    const analytics = await fetchAnalytics(context);
    const baseline = context.analyticsBaseline;

    expectEqual(analytics.total, baseline.total + 3, "Total analytics should increase by 3");
    expectEqual(analytics.pending, baseline.pending + 3, "Pending analytics should increase by 3");
  },
  { destructive: true }
);

addTest(
  "POST /api/bookings/book returns 409 for duplicate pending booking",
  async (context) => {
    await expectStatus(
      "duplicate booking",
      requestJson("/api/bookings/book", {
        method: "POST",
        body: context.liveBookings.pending,
      }),
      409
    );
  },
  { destructive: true }
);

addTest(
  "PATCH /api/admin/bookings/:id/status updates one booking to Reject and one to Accept",
  async (context) => {
    await updateBookingStatus(context, context.liveBookingIds.reject, "Reject", "Live test reject");
    await updateBookingStatus(context, context.liveBookingIds.complete, "Accept", "Live test accept");

    const analytics = await fetchAnalytics(context);
    const baseline = context.analyticsBaseline;

    expectEqual(analytics.total, baseline.total + 3, "Total analytics should remain baseline + 3");
    expectEqual(analytics.pending, baseline.pending + 1, "Pending analytics should now be baseline + 1");
    expectEqual(analytics.reject, baseline.reject + 1, "Reject analytics should now be baseline + 1");
    expectEqual(analytics.accept, baseline.accept + 1, "Accept analytics should now be baseline + 1");
  },
  { destructive: true, adminMutation: true }
);

addTest(
  "PATCH /api/admin/bookings/:id/status completes the accepted booking",
  async (context) => {
    await updateBookingStatus(context, context.liveBookingIds.complete, "Completed", "Live test complete");

    const analytics = await fetchAnalytics(context);
    const baseline = context.analyticsBaseline;

    expectEqual(analytics.total, baseline.total + 3, "Total analytics should remain baseline + 3");
    expectEqual(analytics.pending, baseline.pending + 1, "Pending analytics should remain baseline + 1");
    expectEqual(analytics.reject, baseline.reject + 1, "Reject analytics should remain baseline + 1");
    expectEqual(analytics.accept, baseline.accept, "Accept analytics should return to baseline");
    expectEqual(analytics.completed, baseline.completed + 1, "Completed analytics should now be baseline + 1");
  },
  { destructive: true, adminMutation: true }
);

addTest(
  "POST /api/bookings/book rate limits repeated traffic",
  async () => {
    const statuses = [];

    for (let i = 0; i < 11; i += 1) {
      const payload = makeBookingPayload(`ratelimit-${i}`, {
        email: `${runId}-ratelimit-${i}@example.com`,
      });

      const { response } = await requestJson("/api/bookings/book", {
        method: "POST",
        testIp: "203.0.113.50",
        body: payload,
      });

      statuses.push(response.status);
    }

    if (!statuses.includes(429)) {
      throw new Error(`Expected booking rate limit to trigger, got statuses: ${statuses.join(", ")}`);
    }
  },
  { destructive: true, rateLimited: true }
);

addTest(
  "POST /api/admin/login rate limits repeated failures",
  async () => {
    const statuses = [];

    for (let i = 0; i < 6; i += 1) {
      const { response } = await requestJson("/api/admin/login", {
        method: "POST",
        testIp: "203.0.113.62",
        body: { email: options.adminEmail, password: "still-wrong" },
      });

      statuses.push(response.status);
    }

    if (!statuses.includes(429)) {
      throw new Error(`Expected admin login rate limit to trigger, got statuses: ${statuses.join(", ")}`);
    }
  },
  { rateLimited: true }
);

const shouldRun = (test) => {
  if (test.destructive && !options.includeWrites) {
    return false;
  }

  if (test.adminMutation && !options.includeAdminMutations) {
    return false;
  }

  if (test.rateLimited && !options.includeRateLimit) {
    return false;
  }

  return true;
};

const main = async () => {
  const context = {};
  const selectedTests = tests.filter(shouldRun);
  let passed = 0;

  print.info(`Base URL: ${options.baseUrl}`);
  print.info(`Run ID: ${runId}`);
  print.info(`Log file: ${logFile}`);
  print.info(`Selected ${selectedTests.length} live tests.`);
  print.info(`Real booking writes: ${options.includeWrites ? "enabled" : "disabled"}`);
  print.info(`Real admin mutations: ${options.includeAdminMutations ? "enabled" : "disabled"}`);
  print.info(`Rate-limit stress: ${options.includeRateLimit ? "enabled" : "disabled"}`);

  console.log("");

  for (const test of selectedTests) {
    try {
      await test.run(context);
      passed += 1;
      print.pass(test.name);
    } catch (error) {
      print.fail(test.name);
      console.error(error.message || error);
      writeLog(`ERROR ${error.stack || error.message || error}`);
      process.exitCode = 1;
      break;
    }
  }

  console.log("");

  if (process.exitCode === 1) {
    print.fail(`Stopped after ${passed}/${selectedTests.length} passing live tests.`);
    print.info(`See log file: ${logFile}`);
    return;
  }

  print.pass(`All ${passed} live tests passed.`);
  if (context.liveBookingIds) {
    print.info(`Live booking ids: ${JSON.stringify(context.liveBookingIds)}`);
  }
  print.info(`Log file saved to: ${logFile}`);
};

main();
