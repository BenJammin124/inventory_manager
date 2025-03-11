const { Pool } = require("pg");
require("dotenv").config();

const ROLE_NAME = process.env.ROLE_NAME;
const HOST = process.env.HOST;
const DB = process.env.DB;
const ROLE_PASSWORD = process.env.ROLE_PASSWORD;

module.exports = new Pool({
  connectionString: `postgresql://${ROLE_NAME}:${ROLE_PASSWORD}@${HOST}:5432/${DB}`,
});
