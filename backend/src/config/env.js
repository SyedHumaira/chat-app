// backend/src/config/env.js
import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});
// end of backend/src/config/env.js