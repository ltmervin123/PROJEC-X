const { parseFile } = require("./extractResumeToText");
const { resumeFeedBack } = require("./aiService");

const handleFileUpload = async (req, res) => {
  const file = req.file;
  // const field = req.body.field;

  if (!file) return res.status(400).json({ message: "File is required" });
  // if (!field) return res.status(400).json({ message: "Field is required" });

  try {
    // Parse the uploaded file
    const resumeText = await parseFile(file.path, file.mimetype);

    // Send resume text to AI API
    //const aiResponse = await resumeFeedBack(resumeText, field);

    // Process AI response (resume suggestions and interview questions)
    //const formattedResponse = formatResponse(aiResponse);
    console.log("FIle processed successfully");
    res.status(200).json({
      message: "File processed successfully",
      result: resumeText
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: error.message });
  }
};

const formatResponse = (aiResponse) => {
  return {
    suggestions: aiResponse.resume_suggestions,
    interviewQuestions: aiResponse.interview_questions,
  };
};

module.exports = {
  handleFileUpload,
};
