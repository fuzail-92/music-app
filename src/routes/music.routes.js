const express = require("express");
const multer = require("multer");
const { authArtist } = require("../middlewares/auth.middleware");
const { createMusic } = require("../controllers/music.controller");

// Multer ko memory storage pe configure karo (file RAM mein rakhega, disk pe nahi)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Sirf artist upload kar sakta hai, 'music' field mein file aani chahiye
router.post("/upload", authArtist, upload.single("music"), createMusic);

module.exports = router;
