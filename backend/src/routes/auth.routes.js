const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const { authUser, authArtist } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Temporary test route — middleware check karne ke liye
router.get("/profile", authUser, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

module.exports = router;
