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
  likeMusic,
  unlikeMusic,
  getLikedMusics,
} = require("../controllers/music.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// ---- Specific/named routes pehle ----
router.get("/", authUser, getAllMusics);
router.get("/search", authUser, searchMusics);
router.get("/albums", authUser, getAllAlbums);
router.get("/albums/:albumId", authUser, getAlbumById);
router.get("/likes", authUser, getLikedMusics);

router.post("/upload", authArtist, upload.single("music"), createMusic);
router.post("/album", authArtist, createAlbum);
router.post("/like", authUser, likeMusic);

router.delete("/album/:id", authArtist, deleteAlbum);
router.delete("/like", authUser, unlikeMusic); // <-- ye /:id se PEHLE hona chahiye

router.put("/album/add-music", authArtist, addMusicToAlbum);
router.put("/album/remove-music", authArtist, removeMusicFromAlbum);

// ---- Dynamic (:id wale) routes sabse aakhir mein ----
router.delete("/:id", authArtist, deleteMusic);

module.exports = router;
