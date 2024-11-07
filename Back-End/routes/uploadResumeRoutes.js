const express = require("express");
const upload = require("../utils/initializeResumeUploadUtils");
const {getResumeFeedback} = require("../controllers/uploadResumeController");
const router = express.Router();


// POST /upload route for uploading resume file 
router.post("/get-resume-feedback", upload.single("file"), getResumeFeedback);




module.exports = router;
