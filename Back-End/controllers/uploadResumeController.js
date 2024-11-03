const { parseFile } = require("../services/extractResumeTextService");
const { formatResumeResponse } = require("../utils/responseFormatterUtils");
const { resumeFeedBack } = require("../services/aiService");
const { resumeFeedbackFormatter } = require("../utils/formatterFeebackUtils");

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

    //Extract feedback from AI response
    const {
      content: [{ text }],
    } = aiResponse;

    // const text = 'Overall Score: 7.2/10.0\n' +
    // '\n' +
    // 'Market Strength: You have a solid foundation in IT with a relevant degree and 3 years of experience in software development and system maintenance. Your Java programming skills, database management experience, and Java SE 8 certification are valuable assets in the current market. Your ability to work in team environments and your business-level English proficiency alongside native Japanese are also strong points that make you competitive in the IT field.\n' +
    // '\n' +
    // 'Areas for Improvement: To enhance your marketability, consider expanding your programming language repertoire beyond Java and basic Python. Gaining expertise in popular frameworks and cloud technologies would significantly boost your profile. Additionally, obtaining more certifications in areas like database management or project management could demonstrate a broader skill set. Lastly, highlighting specific achievements or metrics from your projects could make your resume more impactful and showcase your direct contributions to previous employers.'

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
