const path = require("path");
const { convertToMp4 } = require("../../utils/videoConverter");

const getUploadedVideo = async (req, res) => {
  try {
    const videoPath = path.resolve(req.file.path);
    if (videoPath) {
      return res.status(200).json({ message: "Video uploaded successfully" });
    }
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to process video", error: error.message });
  }
};

const getUploadedConvertedVideo = async (req, res) => {
  try {
    // Path to the uploaded video file
    const videoPath = path.resolve(req.file.path);

    console.log(`Converting video: ${videoPath}`);

    // Ensure the file was uploaded
    if (!videoPath) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    // Extract the original file name (without extension)
    const originalFileName = path.parse(req.file.originalname).name;

    // Define the uploads folder path
    const outputFolder = path.join(__dirname, "../../uploads");

    // Call the convertToMp4 function
    const convertedFileName = await convertToMp4(
      videoPath,
      outputFolder,
      originalFileName
    );

    // Send the response with the converted file info
    return res.status(200).json({
      message: "Video uploaded and converted successfully",
      originalFile: req.file.filename,
      convertedFile: convertedFileName,
    });
  } catch (error) {
    console.error(`Error : ${error.message}`);
    return res
      .status(500)
      .json({ message: "Failed to process video", error: error.message });
  }
};

module.exports = { getUploadedConvertedVideo, getUploadedVideo };
