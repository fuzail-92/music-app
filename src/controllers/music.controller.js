const Music = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");

// Music upload karna (sirf artist)
async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file; // multer isko yahan attach karega

    if (!title || !file) {
      return res
        .status(400)
        .json({ message: "Title and music file are required" });
    }

    // File ko base64 mein convert karo (ImageKit ko isi format mein chahiye)
    const fileBase64 = file.buffer.toString("base64");
    const uploadResult = await uploadFile(fileBase64);

    const music = await Music.create({
      uri: uploadResult.url,
      title,
      artist: req.user.id, // middleware se mila hua
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

module.exports = { createMusic };
