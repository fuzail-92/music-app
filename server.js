// Express package ko import karna
const express = require("express");

// Express application banana
const app = express();

// Ek basic route — jab koi browser mein root URL kholega
app.get("/", (req, res) => {
  res.send("Music API is running");
});

// Server ko ek port pe chalana
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
