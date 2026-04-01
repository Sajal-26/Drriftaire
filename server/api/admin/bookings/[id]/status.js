const app = require("../../../../src/app");
const { assertEnv } = require("../../../../src/config/env");

assertEnv();

module.exports = app;
