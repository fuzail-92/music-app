const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    musics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music", // Music model ke sath link
      },
    ],
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Album", albumSchema);
