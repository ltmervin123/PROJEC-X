const multer = require("multer");
const path = require("path");

// Define allowed video file types using regular expressions
const videoFileTypes = /mp4|mov|avi|mkv|webm|flv|webm|wmv/; // Allowed extensions

const allowedMimeTypes = [
  "video/mp4",
  "video/x-matroska",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "video/x-flv",
  "video/x-ms-wmv",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Ensure correct path to 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize upload
const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: 1000000000 }, // Limit file size to ~1GB (adjust as needed)
  fileFilter: (req, file, cb) => {
    // Check file type
    const extname = videoFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Accept the file if both extension and MIME type match
    } else {
      return cb(
        new Error("Invalid file type! Only video files are allowed."),
        false
      ); // Reject the file
    }
  },
});

// Export the upload function to use in your routes
module.exports = uploadVideo;
