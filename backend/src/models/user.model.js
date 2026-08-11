const mongoose = require("mongoose");

// User ka schema define kar rahe hain — MongoDB mein data isi shape mein save hoga
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "artist"],
      default: "user",
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically add ho jayenge
  },
);

module.exports = mongoose.model("User", userSchema);
