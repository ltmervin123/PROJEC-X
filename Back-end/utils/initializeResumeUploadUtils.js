const multer = require("multer");
const path = require("path");

const initializeMulterStorage = (uploadsFolderPath) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsFolderPath); // Use the provided uploads folder path
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        cb(null, uniqueSuffix); // Generate unique filenames
      },
    });
    return multer({ storage });
  } catch (error) {
    console.log(`Error : ${error}`);
  }
};

// Usage example:
const uploadsFolder = path.join(__dirname, "../uploads");
const uploadResume = initializeMulterStorage(uploadsFolder);


module.exports = uploadResume;