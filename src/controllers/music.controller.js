const Music = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const Album = require("../models/album.model");

// Music upload karna (sirf artist)
async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
      return res
        .status(400)
        .json({ message: "Title and music file are required" });
    }

    const fileBase64 = file.buffer.toString("base64");
    const uploadResult = await uploadFile(fileBase64);

    const music = await Music.create({
      uri: uploadResult.url,
      title,
      artist: req.user.id,
    });

    return res.status(201).json({
      message: "Music uploaded successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Sab musics fetch karna, pagination ke sath
async function getAllMusics(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const musics = await Music.find()
      .skip(skip)
      .limit(limit)
      .populate("artist", "username email");

    const total = await Music.countDocuments();

    return res.json({
      message: "Musics fetched successfully",
      musics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Title se music search karna (case-insensitive)
async function searchMusics(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: "Search query parameter q is required" });
    }

    const musics = await Music.find({
      title: { $regex: q, $options: "i" },
    }).populate("artist", "username email");

    return res.json({ message: "Search results", musics });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Music delete karna (sirf apna, artist hi kar sakta hai)
async function deleteMusic(req, res) {
  try {
    const musicId = req.params.id;

    const music = await Music.findById(musicId);
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    if (music.artist.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own music" });
    }

    await Music.findByIdAndDelete(musicId);

    return res.json({ message: "Music deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
// Album create karna (sirf artist)
async function createAlbum(req, res) {
  try {
    const { title, musics } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Album title is required" });
    }
    if (!musics || !Array.isArray(musics) || musics.length === 0) {
      return res.status(400).json({ message: "Musics array is required" });
    }

    // Check karo ke saari music IDs valid hain
    const existingMusics = await Music.find({ _id: { $in: musics } });
    if (existingMusics.length !== musics.length) {
      return res
        .status(400)
        .json({ message: "One or more music IDs are invalid" });
    }

    const album = await Album.create({
      title,
      musics,
      artist: req.user.id,
    });

    return res.status(201).json({
      message: "Album created successfully",
      album: {
        id: album._id,
        title: album.title,
        musics: album.musics,
        artist: album.artist,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Sab albums fetch karna (basic info, musics nahi)
async function getAllAlbums(req, res) {
  try {
    const albums = await Album.find()
      .select("title artist")
      .populate("artist", "username email");
    return res.json({ message: "Albums fetched successfully", albums });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Ek album ki poori detail (musics ke sath)
async function getAlbumById(req, res) {
  try {
    const album = await Album.findById(req.params.albumId)
      .populate("artist", "username email")
      .populate("musics");
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    return res.json({ message: "Album fetched successfully", album });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
// Album delete karna (sirf apna, owner check)
async function deleteAlbum(req, res) {
  try {
    const albumId = req.params.id;
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    if (album.artist.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own albums" });
    }
    await Album.findByIdAndDelete(albumId);
    return res.json({ message: "Album deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Album mein music add karna (owner check)
async function addMusicToAlbum(req, res) {
  try {
    const { albumId, musicId } = req.body;
    if (!albumId || !musicId) {
      return res
        .status(400)
        .json({ message: "albumId and musicId are required" });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    if (album.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your album" });
    }

    const music = await Music.findById(musicId);
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    if (album.musics.includes(musicId)) {
      return res.status(400).json({ message: "Music already in album" });
    }

    album.musics.push(musicId);
    await album.save();
    return res.json({ message: "Music added to album", album });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Album se music remove karna (owner check)
async function removeMusicFromAlbum(req, res) {
  try {
    const { albumId, musicId } = req.body;
    if (!albumId || !musicId) {
      return res
        .status(400)
        .json({ message: "albumId and musicId are required" });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    if (album.artist.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your album" });
    }

    if (!album.musics.includes(musicId)) {
      return res.status(400).json({ message: "Music not in album" });
    }

    album.musics = album.musics.filter((id) => id.toString() !== musicId);
    await album.save();
    return res.json({ message: "Music removed from album", album });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
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
};
