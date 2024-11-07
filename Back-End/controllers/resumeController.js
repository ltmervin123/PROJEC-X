const { parseFile } = require("../services/extractResumeTextService");
const { formatResumeResponse } = require("../utils/responseFormatterUtils");
const { resumeFeedBack } = require("../services/aiService");
const { resumeFeedbackFormatter } = require("../utils/formatterFeebackUtils");
const { CustomException } = require("../exception/customException");

const getResumeFeedback = async (req, res) => {
  const file = req.file;
  const field = req.body.field;

  try {
    // Check if file is uploaded
    if (!file) {
      throw new CustomException("Resume is required", 400, "NoResumeException");
    }

    // Check if field is provided
    if (!field) {
      throw new CustomException("Field is required", 400, "NoFieldException");
    }

    // Parse the uploaded file
    const resumeText = await parseFile(file.path, file.mimetype);

    // Send resume text to AI API
    const aiResponse = await resumeFeedBack(resumeText, field);

    //Extract feedback from AI response
    const {
      content: [{ text }],
    } = aiResponse;

    // Format the response
    const formattedFeedback = resumeFeedbackFormatter(text);
    console.log(`Formatted feedback:`, formattedFeedback);
    console.log("AI response:", aiResponse);
    console.log("Resume feedback:", text);

    // Send the formatted response
    res.status(200).json({
      message: "File processed successfully",
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResumeFeedback,
};
