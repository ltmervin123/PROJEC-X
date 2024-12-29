const express = require("express");
const uploadVideo = require("../utils/initializeVideoUploadUtils");
const uploadResume = require("../utils/initializeResumeUploadUtils");
const {
  startMockInterview,
  generateQuestions,
  createOverallFeedback,
  getTextAudio,
  getFeedback,
  finalGreeting,
} = require("../controllers/interviewController");
const requireAuthMiddleware = require("../middleware/requireAuthMiddleware");
const router = express.Router();

router.use(requireAuthMiddleware);
router.post(
  "/generate-questions",
  uploadResume.single("file"),
  generateQuestions
);
// router.post("/mock-interview", uploadVideo.single("videoFile"), startMockInterview);
router.post("/mock-interview", startMockInterview);
router.post("/create-feedback", createOverallFeedback);
router.post("/audio", getTextAudio);
router.post("/final-greeting", finalGreeting);
router.get("/get-feedback", getFeedback);

module.exports = router;
