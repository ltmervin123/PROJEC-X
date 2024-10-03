const express = require('express');
const router = express.Router();

// Import specific route files
const uploadResumeRoutes = require('./uploadResumeFile');
const uploadVideoRoutes = require('./uploadVideoFile');

// Group all routes under /api
router.use('/upload-resume', uploadResumeRoutes);
router.use('/upload-video', uploadVideoRoutes);

module.exports = router;
