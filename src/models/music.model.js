const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    uri: {
      type: String,
      required: true, // ImageKit se mila hua file URL
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // kis User (artist) ne upload kiya
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Music", musicSchema);
