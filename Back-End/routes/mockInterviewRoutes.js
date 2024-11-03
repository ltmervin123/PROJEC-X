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

router.post("/generateQuestions/:difficulty", upload.single("file"), generateQuestions);
router.post("/mockInterview", upload.single("videoFile"), startMockInterview);
router.get("/result", generateOverAllFeedback);
router.post("/Audio", getTextAudio);

module.exports = router;
