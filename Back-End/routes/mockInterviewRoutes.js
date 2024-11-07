const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {
  generateFirstQuestion,
  startMockInterview,
  getFeedback,
  generateFirstTwoQuestions,
  generateQuestions,
  generateOverAllFeedback,
  getTextAudio
} = require("../controllers/mockInterviewController");
const router = express.Router();

router.post("/generate-questions/:difficulty", upload.single("file"), generateQuestions);
router.post("/mock-interview", upload.single("videoFile"), startMockInterview);
router.get("/result", generateOverAllFeedback);
router.post("/audio", getTextAudio);

module.exports = router;
