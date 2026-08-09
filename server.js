require("dotenv").config();

const validateEnv = require("./src/config/validateEnv");
validateEnv();

const express = require("express");
const connectDB = require("./src/db/db");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

// Body ko JSON ki tarah parse karne ke liye — is se req.body kaam karega
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Music API is running");
});

// Auth routes ko /api/auth prefix ke sath jodo
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

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
