const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  DB_USER: process.env.DB_USER,
  DB_PWD: process.env.DB_PWD,
  DB_URL: process.env.DB_URL,
};
