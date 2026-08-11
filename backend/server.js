require("dotenv").config();

const validateEnv = require("./src/config/validateEnv");
validateEnv();

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const connectDB = require("./src/db/db");
const authRoutes = require("./src/routes/auth.routes");
const musicRoutes = require("./src/routes/music.routes");

const app = express();

// Request logging — har request terminal mein print hogi
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting — 15 minute mein max 100 requests per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Body parsing aur cookies
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Music API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

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
