const express = require("express");
const multer = require("multer");
const { authArtist, authUser } = require("../middlewares/auth.middleware");
const {
  createMusic,
  getAllMusics,
  searchMusics,
} = require("../controllers/music.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Koi bhi logged-in user dekh/search kar sakta hai
router.get("/", authUser, getAllMusics);
router.get("/search", authUser, searchMusics);

// Sirf artist upload kar sakta hai
router.post("/upload", authArtist, upload.single("music"), createMusic);

module.exports = router;
