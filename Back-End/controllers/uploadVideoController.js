const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
const { interviewAnswersFeeback } = require("../services/aiService");
const { formatInterviewResponse } = require("../utils/responseFormatterUtils");

const getInterviewFeedBack = async (req, res) => {
  try {
    // const { question } = req.body;

    // if (!question) {
    //   return res.status(400).json({ message: "Question is required" });
    // }

    const videoPath = path.resolve(req.file.path);
    const extractedText = await processVideoFile(videoPath); 
    const answer = extractedText;
    console.log(`Extracted Text : ${answer}`);

    // const aiResponse = await interviewAnswersFeeback(question, answer);
    // const formattedResponse = formatInterviewResponse(aiResponse);

    // return res.status(200).json({
    //   message: "Answer processed successfully",
    //   result: formattedResponse,
    // });

    return res.status(200).json({
      message: "Answer processed successfully",
      result: answer,
    });

  } catch (error) {
    console.log(`Error : ${error.message}`);  
    res.status(500).json({ message : "Failed to process video", error: error.message });
  }
};

module.exports = {
  getInterviewFeedBack,
};
