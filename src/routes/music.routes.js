const express = require("express");
const multer = require("multer");
const { authArtist, authUser } = require("../middlewares/auth.middleware");
const {
  createMusic,
  getAllMusics,
  searchMusics,
  deleteMusic,
} = require("../controllers/music.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", authUser, getAllMusics);
router.get("/search", authUser, searchMusics);

router.post("/upload", authArtist, upload.single("music"), createMusic);
router.delete("/:id", authArtist, deleteMusic);

module.exports = router;
