v = require("dotenv").config(); // .env file load karna sabse pehle

const validateEnv = require("./src/config/validateEnv");
validateEnv();

const express = require("express");
const connectDB = require("./src/db/db");

const app = express();

app.get("/", (req, res) => {
  res.send("Music API is running");
});

const PORT = process.env.PORT || 3000;

// Pehle database se connect karo, tab hi server start karo
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
