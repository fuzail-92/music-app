const { ImageKit } = require("@imagekit/nodejs");

// ImageKit client banao apni private key se
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// Ek file (base64 string) ko ImageKit pe upload karo
async function uploadFile(fileBase64) {
  const result = await imagekit.files.upload({
    file: fileBase64,
    fileName: `music_${Date.now()}`, // unique naam, taake overwrite na ho
    folder: "/music-app",
  });
  return result;
}

module.exports = { uploadFile };
