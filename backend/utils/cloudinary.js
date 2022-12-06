// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// for server to server upload
const dotenv = require("dotenv");
dotenv.config();


// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

module.exports = cloudinary;