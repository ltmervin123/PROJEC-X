const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads")); // Ensure correct path to 'uploads'
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  
  
  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // limit file size to ~100MB
    fileFilter: (req, file, cb) => {
      // Check file type
      try {
        const filetypes = /video\/mp4|video\/mkv|video\/avi|video\/mov/;
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);
        return cb(null, true);
      } catch (error) {
        console.log(`Error name : ${error}`);
      }
    },
  });

  module.exports = upload;