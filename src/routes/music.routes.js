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
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  getUserPlaylists,
  deletePlaylist,
} = require("../controllers/music.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// ---- GET routes (specific/named pehle) ----
router.get("/", authUser, getAllMusics);
router.get("/search", authUser, searchMusics);
router.get("/albums", authUser, getAllAlbums);
router.get("/albums/:albumId", authUser, getAlbumById);
router.get("/likes", authUser, getLikedMusics);
router.get("/playlists", authUser, getUserPlaylists);

// ---- POST routes ----
router.post("/upload", authArtist, upload.single("music"), createMusic);
router.post("/album", authArtist, createAlbum);
router.post("/like", authUser, likeMusic);
router.post("/playlist", authUser, createPlaylist);
router.post("/playlist/add", authUser, addToPlaylist);
router.post("/playlist/remove", authUser, removeFromPlaylist);

// ---- DELETE routes (specific pehle, /:id sabse aakhir) ----
router.delete("/album/:id", authArtist, deleteAlbum);
router.delete("/like", authUser, unlikeMusic);
router.delete("/playlist/:id", authUser, deletePlaylist);
router.delete("/:id", authArtist, deleteMusic);

// ---- PUT routes ----
router.put("/album/add-music", authArtist, addMusicToAlbum);
router.put("/album/remove-music", authArtist, removeMusicFromAlbum);

module.exports = router;
