const { parseFile } = require("../services/extractResumeTextService");
const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
const { convertToMp4 } = require("../utils/videoConverter");
const { interviewAnswersFeeback } = require("../services/aiService");
const { generateFollowUpQuestion } = require("../services/aiService");
const {
  generateFirstQuestion: generatedAiFirstQuesttion,
} = require("../services/aiService");

const generateFirstQuestion = async (req, res) => {
  const file = req.file;
  // Check if file is present
  !file && res.status(400).json({ message: "File is required" });

  try {
    const resumeText = await parseFile(file.path, file.mimetype);
    const aiResponse = await generatedAiFirstQuesttion(resumeText);

    const {
      content: [{ text }],
    } = aiResponse;

    console.log(`Ai Response: `, aiResponse);
    console.log("First question generated successfully:", text);
    return res
      .status(200)
      .json({ message: "File processed successfully", text });
  } catch (error) {
    console.error("Error processing file:", error);
    console.log("Error processing file:", error);
    return res.status(500).json({ message: error.message });
  }
};

const startMockInterview = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Path to the uploaded video file
    const videoPath = path.resolve(req.file.path);

    // Extract the original file name (without extension)
    // const originalFileName = path.parse(req.file.originalname).name;

    // // Define the uploads folder path
    // const outputFolder = path.join(__dirname, "../uploads");

    // // Call the convertToMp4 function
    // const convertedFileName = await convertToMp4(
    //   videoPath,
    //   outputFolder,
    //   originalFileName
    // );

    // extracted text from the video as answer
    const extractedText = await processVideoFile(videoPath);

    // // Call the AI service to get feedback on the answer
    // const aiResponse = await interviewAnswersFeeback(question, extractedText);

    // // Generate a follow-up question based on the answer
    // const nextQuestion = await generateFollowUpQuestion(extractedText);

    // Run both API calls concurrently using Promise.all
    const [aiResponse, nextQuestion] = await Promise.all([
      interviewAnswersFeeback(question, extractedText),
      generateFollowUpQuestion(extractedText),
    ]);

    // Extract the feedback from the AI response
    // const {
    //   content: [{ text }],
    // } = aiResponse;
    
    const feedback = aiResponse.content[0].text;
    const nextQuestionText = nextQuestion.content[0].text;

    console.log(`Feedback: ${feedback}/n`);
    console.log(`Next Question: ${nextQuestionText}/n`);
    console.log(`AI Response: `, aiResponse);

    return res.status(200).json({
      message: "Answer processed successfully",
      feedback: feedback,
      nextQuestion: nextQuestionText,
    });
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to process video", error: error.message });
  }
};

module.exports = { generateFirstQuestion, startMockInterview };
