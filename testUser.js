require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user.model");

async function testUserModel() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected for testing");

  // Ek test user banane ki koshish
  const testUser = await User.create({
    username: "testuser1",
    email: "test1@example.com",
    password: "123456",
  });

  console.log("User created:", testUser);

  await mongoose.disconnect();
  console.log("Disconnected");
}

testUserModel().catch((err) => console.error("Error:", err.message));
