const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {
  startMockInterview,
  generateQuestions,
  generateOverAllFeedback,
  getTextAudio,
} = require("../controllers/interviewController");
const requireAuthMiddleware = require("../middleware/requireAuthMiddleware");
const router = express.Router();

router.use(requireAuthMiddleware);
router.post(
  "/generate-questions/:userId/:difficulty",
  upload.single("file"),
  generateQuestions
);
router.post("/mock-interview", upload.single("videoFile"), startMockInterview);
router.get("/result", generateOverAllFeedback);
router.post("/audio", getTextAudio);

module.exports = router;
