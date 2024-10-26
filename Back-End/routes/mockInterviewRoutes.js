const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {
  generateFirstQuestion,
  startMockInterview,
  getFeedback,
  generateFirstTwoQuestions,
  generateQuestions,
  generateOverAllFeedback
} = require("../controllers/mockInterviewController");
const router = express.Router();

router.post("/uploadResume", upload.single("file"), generateFirstQuestion);
router.post("/generateQuestions", upload.single("file"), generateFirstTwoQuestions);
router.post("/mockInterview", upload.single("videoFile"), startMockInterview);
router.get("/result", generateOverAllFeedback);

module.exports = router;
