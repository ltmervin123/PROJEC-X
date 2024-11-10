const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const { getResumeFeedback } = require("../controllers/resumeController");
const router = express.Router();
const requireAuthMiddleware = require("../middleware/requireAuthMiddleware");

router.use(requireAuthMiddleware);
// POST /upload route for uploading resume file
router.post("/get-resume-feedback", upload.single("file"), getResumeFeedback);

module.exports = router;
