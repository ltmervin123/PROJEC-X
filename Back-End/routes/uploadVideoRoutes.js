const express = require("express");
const upload = require("../utils/initializeVideoUploadUtils");
const {
  getInterviewFeedBack,
} = require("../controllers/uploadVideoController");
const router = express.Router();

// POST route for uploading uploading  recorded video file
router.post("/uploadVideo", upload.single("videoFile"), getInterviewFeedBack);

module.exports = router;
