const express = require('express');
const multer = require('multer');
const fileParser = require('../services/fileParser');

const router = express.Router();

// Configure Multer to save uploaded files to 'uploads/' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// POST route for uploading video and converting it to text
router.post('/upload', upload.single('videoFile'), async (req, res) => {
    try {
        const videoPath = req.file.path;
        const audioText = await fileParser.processVideoFile(videoPath);
        res.status(200).json({ transcription: audioText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process video' });
    }
});

module.exports = router;
