const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    music: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Ek user ek music ko sirf ek hi baar like kar sake — database level pe enforce
likeSchema.index({ user: 1, music: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
