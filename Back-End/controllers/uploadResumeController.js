const { parseFile } = require("../services/extractResumeTextService");
const { formatResumeResponse } = require("../utils/responseFormatterUtils");
const { resumeFeedBack } = require("../services/aiService");

const getResumeFeedback = async (req, res) => {
  const file = req.file;
  const field = req.body.field;
  // const field = "Software Engineer";  Hardcoded for testing

  if (!file) return res.status(400).json({ message: "File is required" });
  // if (!field) return res.status(400).json({ message: "Field is required" });

  try {
    // Parse the uploaded file
    const resumeText = await parseFile(file.path, file.mimetype);

    // Send resume text to AI API
    const aiResponse = await resumeFeedBack(resumeText, field);

    const {
      content: [{ text }],
    } = aiResponse;

    // Process AI response (resume suggestions and interview questions)
    // const formattedResponse = formatResumeResponse(aiResponse);

    // Send the formatted response
    res.status(200).json({
      message: "File processed successfully",
      result: text,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResumeFeedback,
};
