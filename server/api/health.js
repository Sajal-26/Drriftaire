const { assertEnv } = require("../src/config/env");

assertEnv();

module.exports = (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
};
