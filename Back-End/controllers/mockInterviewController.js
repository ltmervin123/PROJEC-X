const { parseFile } = require("../services/extractResumeTextService");
const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
const { feedbacks } = require("../data/feedback");
const { questions } = require("../data/questions");
let { answerAndQuestion } = require("../data/answerAndQuestion");
const { convertTextToAudio } = require("../services/textToAudioService");
const {
  interviewAnswersFeeback,
  generateFirstQuestion: generatedAiFirstQuesttion,
  generateFollowUpQuestion,
  generateFirstTwoQuestions: generatedAiFirstTwoQuesttions,
  generateQuestions: generatedQuestions,
  generateOverAllFeedback: generatedOverAllFeedback,
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

const generateFirstTwoQuestions = async (req, res) => {
  const file = req.file;

  // check if file is present
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    // Extract text from the resume
    const resumeText = await parseFile(file.path, file.mimetype);
    // Call the AI service to generate the first two questions
    const aiResponse = await generatedAiFirstTwoQuesttions(resumeText);

    // Extract the questions from the response
    const {
      content: [{ text }],
    } = aiResponse;

    // Split the text into an array of questions
    const question = text
      .split(/\?\s*\n+/)
      .map((q) => q.trim() + "?")
      .filter(Boolean);

    // Store the  questions in the question array
    question.forEach((q) => {
      questions.push(q);
    });

    console.log(question);

    console.log(`Ai Response: `, aiResponse);
    console.log(`Questions: `, question);

    return res.status(200).json({
      message: "Genereting first two question successfully",
      question,
    });
  } catch (error) {
    console.log("Error processing file:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const generateQuestions = async (req, res) => {
  const file = req.file;

  // check if file is present
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    // Extract text from the resume
    const resumeText = await parseFile(file.path, file.mimetype);
    // Call the AI service to generate the first two questions
    const aiResponse = await generatedQuestions(resumeText);

    // Extract the questions from the response
    const {
      content: [{ text }],
    } = aiResponse;

    // Split the text into an array of questions
    const question = text.split(/\n*\d+\.\s/).filter(Boolean);

    // Store the  questions in the question array
    question.forEach((q) => {
      questions.push(q);
    });

    console.log(`Ai Response: `, aiResponse);
    console.log(`Qestions: `, question);

    return res.status(200).json({
      message: "Genereting  questions successfully",
      question,
    });
  } catch (error) {
    console.log("Error processing file:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// const startMockInterview = async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question) {
//       return res.status(400).json({ message: "Question is required" });
//     }

//     // Path to the uploaded video file
//     const videoPath = path.resolve(req.file.path);

//     // // Extract the original file name (without extension)
//     // const originalFileName = path.parse(req.file.originalname).name;

//     // // Define the uploads folder path
//     // const outputFolder = path.join(__dirname, "../uploads");

//     // // Call the convertToMp4 function
//     // const convertedFileName = await convertToMp4(
//     //   videoPath,
//     //   outputFolder,
//     //   originalFileName
//     // );

//     // extracted text from the video as answer
//     const extractedText = await processVideoFile(videoPath);

//     // Run both API calls concurrently using Promise.all
//     const [aiResponse, nextQuestion] = await Promise.all([
//       interviewAnswersFeeback(question, extractedText),
//       generateFollowUpQuestion(extractedText),
//     ]);

//     const feedback = aiResponse.content[0].text;
//     const nextQuestionText = nextQuestion.content[0].text;
//     const convertedAudio = await convertTextToAudio(feedback);

//     // Store the next question in the question array
//     questions.push(nextQuestionText);

//     // Store the feedback in the feedback array
//     feedbacks.push(feedback);

//     // Send the response back to the client
//     return res.status(200).json({
//       message: "Answer processed successfully",
//       feedback: feedback,
//       nextQuestion: nextQuestionText,
//       audio: convertedAudio,
//     });
//   } catch (error) {
//     console.log(`Error : ${error.message}`);
//     res
//       .status(500)
//       .json({ message: "Failed to process video", error: error.message });
//   }
// };

//v2
const startMockInterview = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Path to the uploaded video file
    const videoPath = path.resolve(req.file.path);

    // extracted text from the video as answer
    const answer = await processVideoFile(videoPath);

    console.log(`Answer: `, answer);
    console.log(`Question: `, question);

    //Store question and answer in the answerAndQuestion array
    answerAndQuestion.push({ question, answer });
    console.log(`Answer and Question: `, answerAndQuestion);

    return res.status(200).json({ message: "Video processed successfully" });
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

const generateOverAllFeedback = async (req, res) => {
  try {
    const response = await generatedOverAllFeedback(answerAndQuestion);

    const {
      content: [{ text }],
    } = response;

    console.log("Feedback: ", text);
    // reset the answer and question array
    answerAndQuestion = [];

    console.log(`Ai Response: `, response);
    console.log("Feedback generated successfully:");
    console.log("Feedback: ", text);
    return res
      .status(200)
      .json({ message: "Feedback generated successfully", text });
  } catch (error) {
    console.log("Error generating feedback:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateFirstQuestion,
  startMockInterview,
  getFeedback,
  generateFirstTwoQuestions,
  generateQuestions,
  generateOverAllFeedback,
};
