require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const apiRoutes = require("./src/routes/api");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server Berjalan di http://localhost:${PORT}`);
});
