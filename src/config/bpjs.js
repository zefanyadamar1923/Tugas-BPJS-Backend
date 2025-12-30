require("dotenv").config();

module.exports = {
  URL_LIST: process.env.BPJS_URL_LIST,
  URL_TASK: process.env.BPJS_URL_TASK,
  HEADERS: {
    "Content-Type": "application/json",
  },
};
