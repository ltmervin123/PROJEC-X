const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {
  startMockInterview,
  generateQuestions,
  createOverallFeedback,
  getTextAudio,
  getFeedback,
} = require("../controllers/interviewController");
const requireAuthMiddleware = require("../middleware/requireAuthMiddleware");
const router = express.Router();

router.use(requireAuthMiddleware);
router.post("/generate-questions", upload.single("file"), generateQuestions);
router.post("/mock-interview", upload.single("videoFile"), startMockInterview);
router.post("/create-feedback", createOverallFeedback);
router.post("/audio", getTextAudio);
router.get("/get-feedback", getFeedback);

module.exports = router;
