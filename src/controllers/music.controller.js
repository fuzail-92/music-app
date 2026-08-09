const Music = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");

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

module.exports = { createMusic, getAllMusics, searchMusics, deleteMusic };
