const multer = require("multer");

// Use memory storage to process file as a buffer
const storage = multer.memoryStorage();

// Filter for only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;


// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "products",
//     allowed_formats: ["jpg", "png", "jpeg"],
//     transformation: [
//       { width: 200, height: 200, crop: "fill", gravity: "center" },
//     ],
//   },
// });

// const upload = multer({ storage });

// module.exports = { upload };
