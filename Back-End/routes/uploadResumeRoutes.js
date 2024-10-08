const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {getResumeFeedback} = require("../controllers/uploadResumeController");
const router = express.Router();


// POST /upload route for file uploads
router.post("/uploadResume", upload.single("file"), getResumeFeedback);

module.exports = router;
