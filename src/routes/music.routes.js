const express = require("express");
const multer = require("multer");
const { authArtist, authUser } = require("../middlewares/auth.middleware");
const {
  createMusic,
  getAllMusics,
  searchMusics,
  deleteMusic,
  createAlbum,
  getAllAlbums,
  getAlbumById,
  deleteAlbum,
  addMusicToAlbum,
  removeMusicFromAlbum,
} = require("../controllers/music.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", authUser, getAllMusics);
router.get("/search", authUser, searchMusics);
router.get("/albums", authUser, getAllAlbums);
router.get("/albums/:albumId", authUser, getAlbumById);

router.post("/upload", authArtist, upload.single("music"), createMusic);
router.post("/album", authArtist, createAlbum);
router.delete("/:id", authArtist, deleteMusic);

router.post("/album", authArtist, createAlbum);
router.delete("/album/:id", authArtist, deleteAlbum);
router.put("/album/add-music", authArtist, addMusicToAlbum);
router.put("/album/remove-music", authArtist, removeMusicFromAlbum);

module.exports = router;
