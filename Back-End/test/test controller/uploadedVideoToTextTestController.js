const { processVideoFile } = require("../../services/videoToTextService");
const path = require("path");

const convertVideoToText = async (req, res) => {
  try {
    const videoPath = path.resolve(req.file.path);
    const extractedText = await processVideoFile(videoPath);
    console.log(`Extracted Text : ${extractedText}`);
    return res.status(200).json({
      message: "Video processed successfully",
      result: extractedText,
    });
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to process video", error: error.message });
  }
};

module.exports = { convertVideoToText };
