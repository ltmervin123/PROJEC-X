const express = require("express");
const multer = require("multer");
const path = require("path");
const { parseFile } = require("../services/extractResumeToText");
const { handleFileUpload } = require("../services/handleResumeFeedBack");
const { sendToAI } = require("../services/aiService");

const router = express.Router();

// Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "..uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../uploads")); // Ensure correct path to 'uploads'
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });
const initializeMulterStorage = (uploadsFolderPath) => {
  try{
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
  }catch(error){
    console.log(`Error : ${error}`);
  }
};

// Usage example:
const uploadsFolder = path.join(__dirname, "../uploads");
const upload = initializeMulterStorage(uploadsFolder);

// POST /upload route for file uploads
router.post("/uploadResume", upload.single("file"), handleFileUpload);

// POST for testing extracting text from a PDF or Docx file
router.post("/test", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    // Parse the uploaded file
    const extractedText = await parseFile(filePath, fileType);

    // Send the extracted text as the response for testing
    res.json({
      message: "File uploaded and parsed successfully",
      extractedText: extractedText,
    });
  } catch (error) {
    console.error("Error parsing file:", error);
    res.status(500).json({ error: "Error parsing file - " + error.message });
  }
});

// POST for testing sending text to AI API
router.post("/test-ai", async (req, res) => {
  try {
    // Send resume text to AI API
    const aiResponse = await sendToAI();

    res.json({ message: "AI API request successful", response: aiResponse });
  } catch (error) {
    console.error("Error sending text to AI API:", error);
    res
      .status(500)
      .json({ error: "Error sending text to AI API - " + error.message });
  }
});

module.exports = router;
