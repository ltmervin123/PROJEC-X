const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {generateFirstQuestion} = require("../controllers/mockInterviewController");
const {startMockInterview} = require("../controllers/mockInterviewController");
const router = express.Router();

// POST /upload route for uploading resume file
router.post("/uploadResume", upload.single("file"), generateFirstQuestion);

router.post("/mockInterview", upload.single("videoFile"),startMockInterview);
module.exports = router;
