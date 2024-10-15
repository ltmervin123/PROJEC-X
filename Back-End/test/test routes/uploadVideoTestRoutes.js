const express = require("express");
const upload = require("../../utils/initializeVideoUploadUtils");
const {
  getUploadedVideo,
  getUploadedConvertedVideo,
} = require("../test controller/getUploadedVideoTestController");
const router = express.Router();
const {
  convertVideoToText,
} = require(`../test controller/uploadedVideoToTextTestController`);

// POST route for uploading video file to the back end
// router.post("/uploadVideo", upload.single("videoFile"), getUploadedVideo);

// POST route for extraxting text from uploaded video file
router.post("/uploadVideo", upload.single("videoFile"), getUploadedConvertedVideo);

module.exports = router;
