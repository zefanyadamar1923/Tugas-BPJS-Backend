require("dotenv").config();

module.exports = {
  consId: process.env.BPJS_CONS_ID,
  secretKey: process.env.BPJS_SECRET_KEY,
  userKey: process.env.BPJS_USER_KEY,
  baseUrl: process.env.BASE_URL,
  URL_LIST: process.env.BPJS_URL_LIST,
  URL_TASK: process.env.BPJS_URL_TASK,
  HEADERS: {
    "Content-Type": "application/json",
  },
};
