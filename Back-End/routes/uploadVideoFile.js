const express = require("express");
const multer = require("multer");
const path = require("path");
const extractedVideo = require("../services/extractVideoToText");
const { convertTextToAudio } = require("../services/convertTextToAudio");
const router = express.Router();

//Configure Multer to save uploaded files to 'uploads/' directory
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

// POST route for uploading video and converting it to text
router.post("/uploadVideo", upload.single("videoFile"), async (req, res) => {
  console.log("Upload Video Routes 1");
  try {
    console.log("Upload Video Routes 2");
    // const videoPath = req.file.path;
    const videoPath = path.resolve(req.file.path);
    console.log(`Upload Video Routes 3`);
    const audioText = await extractedVideo.processVideoFile(videoPath);
    console.log("Upload Video Routes 4");
    res.status(200).json({ transcription: audioText });
  } catch (error) {
    console.error(`Error `);
    res.status(500).json({ error: "Failed to process video" });
  }
});

// POST routes for audio to text testing
router.post("/audioToText", async (req, res) => {
  const text =
    req.body.text || res.status(400).json({ message: "Text is required" });
  try {
    const textAudio = await convertTextToAudio(text);
    res.set("content-type", "audio/mp3");
    res.send(textAudio);
    // res.status(200).json({ transcription: textAudio });
  } catch (error) {
    console.error(`Error `);
    res.status(500).json({ error: "Failed to process audio" });
  }
});

module.exports = router;
