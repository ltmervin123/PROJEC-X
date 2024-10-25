const { parseFile } = require("../services/extractResumeTextService");
const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
const { feedbacks } = require("../data/feedback");
const { questions } = require("../data/questions");
const { convertTextToAudio } = require("../services/textToAudioService");
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

    // Store the first question in the question array
    questions.push(text);

    console.log(`Ai Response: `, aiResponse);
    console.log("First question generated successfully:");

    return res
      .status(200)
      .json({ message: "File processed successfully", text });
  } catch (error) {
    console.log("Error processing file:", error.message);
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

    // // Extract the original file name (without extension)
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

    // Run both API calls concurrently using Promise.all
    const [aiResponse, nextQuestion] = await Promise.all([
      interviewAnswersFeeback(question, extractedText),
      generateFollowUpQuestion(extractedText),
    ]);

    const feedback = aiResponse.content[0].text;
    const nextQuestionText = nextQuestion.content[0].text;
    const convertedAudio = await convertTextToAudio(feedback);

    // Store the next question in the question array
    questions.push(nextQuestionText);

    // Store the feedback in the feedback array
    feedbacks.push(feedback);

    // Send the response back to the client
    return res.status(200).json({
      message: "Answer processed successfully",
      feedback: feedback,
      nextQuestion: nextQuestionText,
      audio: convertedAudio,
    });
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to process video", error: error.message });
  }
};

const getFeedback = (req, res) => {
  try {
    if (!feedbacks) {
      return res.status(404).json({ message: "No feedback found" });
    }
    return res.status(200).json({ feedbacks });
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to get feedback", error: error.message });
  }
};

module.exports = { generateFirstQuestion, startMockInterview, getFeedback };
