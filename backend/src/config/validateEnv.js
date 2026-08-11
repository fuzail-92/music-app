// Wo saari environment variables jo hamesha honi chahiye
const requiredEnv = ["PORT", "MONGO_URI", "JWT_SECRET", "IMAGEKIT_PRIVATE_KEY"];
function validateEnv() {
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      console.error(`Missing environment variable: ${key}`);
      process.exit(1); // App ko turant rok do
    }
  }
  console.log("Environment variables validated");
}

module.exports = validateEnv;
