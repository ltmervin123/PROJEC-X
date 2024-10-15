const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
const { convertToMp4 } = require("../utils/videoConverter");
const { interviewAnswersFeeback } = require("../services/aiService");
const { formatInterviewResponse } = require("../utils/responseFormatterUtils");

const getInterviewFeedBack = async (req, res) => {
  try {
    // const { question } = req.body;

    // if (!question) {
    //   return res.status(400).json({ message: "Question is required" });
    // }

    // for testing purposes
    const question = "What is the difference between HTML and CSS?";

    // Path to the uploaded video file
    const videoPath = path.resolve(req.file.path);

    // Extract the original file name (without extension)
    const originalFileName = path.parse(req.file.originalname).name;

    // Define the uploads folder path
    const outputFolder = path.join(__dirname, "../uploads");

    // Call the convertToMp4 function
    const convertedFileName = await convertToMp4(
      videoPath,
      outputFolder,
      originalFileName
    );

    const extractedText = await processVideoFile(convertedFileName);
    console.log(`Extracted Text : ${extractedText}`);

    // const aiResponse = await interviewAnswersFeeback(question, extractedText);

    // console.log(`AI Response: `, aiResponse);

    return res.status(200).json({
      message: "Answer processed successfully",
      result: extractedText,
    });
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to process video", error: error.message });
  }
};

module.exports = {
  getInterviewFeedBack,
};
