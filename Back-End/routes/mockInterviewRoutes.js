const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {
  generateFirstQuestion,
  startMockInterview,
  getFeedback,
} = require("../controllers/mockInterviewController");
const router = express.Router();

router.post("/uploadResume", upload.single("file"), generateFirstQuestion);
router.post("/mockInterview", upload.single("videoFile"), startMockInterview);
router.get("/result", getFeedback);

module.exports = router;
