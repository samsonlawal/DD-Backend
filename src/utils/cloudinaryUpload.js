const cloudinary = require("../config/cloudinary");

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - Cloudinary secure URL
 */
const uploadToCloudinary = (buffer, folder = "products") => {
  // console.log('buffer_length:', buffer.length)
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
        // console.log("Cloudinary URL:", result.secure_url)
      },
      
    );
    uploadStream.end(buffer);
  });
};

module.exports = uploadToCloudinary;
