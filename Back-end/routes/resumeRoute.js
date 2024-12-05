const express = require("express");
const uploadResume = require("../utils/initializeResumeUploadUtils");
const { getResumeFeedback } = require("../controllers/resumeController");
const router = express.Router();
const requireAuthMiddleware = require("../middleware/requireAuthMiddleware");

router.use(requireAuthMiddleware);
// POST /upload route for uploading resume file
router.post("/get-resume-feedback", uploadResume.single("file"), getResumeFeedback);

module.exports = router;
