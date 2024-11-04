const { parseFile } = require("../services/extractResumeTextService");
const { parseFeedback } = require("../utils/formatterFeebackUtils");
const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
const { feedbacks } = require("../data/feedback");
const { questions } = require("../data/questions");
let { answerAndQuestion } = require("../data/answerAndQuestion");
const { convertTextToAudio } = require("../services/textToAudioService");
const CustomException = require("../exception/customException");
const {
  interviewAnswersFeeback,
  generateFirstQuestion: generatedAiFirstQuesttion,
  generateFollowUpQuestion,
  generateFirstTwoQuestions: generatedAiFirstTwoQuesttions,
  generateQuestions: generatedQuestions,
  generateOverAllFeedback: generatedOverAllFeedback,
} = require("../services/aiService");

// const generateFirstQuestion = async (req, res) => {
//   const file = req.file;
//   // Check if file is present
//   !file && res.status(400).json({ message: "File is required" });

//   try {
//     const resumeText = await parseFile(file.path, file.mimetype);
//     const aiResponse = await generatedAiFirstQuesttion(resumeText);

//     const {
//       content: [{ text }],
//     } = aiResponse;

//     // Store the first question in the question array
//     questions.push(text);

//     console.log(`Ai Response: `, aiResponse);
//     console.log("First question generated successfully:");

//     return res
//       .status(200)
//       .json({ message: "File processed successfully", text });
//   } catch (error) {
//     console.log("Error processing file:", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };

// const generateFirstTwoQuestions = async (req, res) => {
//   const file = req.file;

//   // check if file is present
//   if (!file) {
//     return res.status(400).json({ message: "File is required" });
//   }

//   try {
//     // Extract text from the resume
//     const resumeText = await parseFile(file.path, file.mimetype);
//     // Call the AI service to generate the first two questions
//     const aiResponse = await generatedAiFirstTwoQuesttions(resumeText);

//     // Extract the questions from the response
//     const {
//       content: [{ text }],
//     } = aiResponse;

//     // Split the text into an array of questions
//     const question = text
//       .split(/\?\s*\n+/)
//       .map((q) => q.trim() + "?")
//       .filter(Boolean);

//     // Store the  questions in the question array
//     question.forEach((q) => {
//       questions.push(q);
//     });

//     console.log(question);

//     console.log(`Ai Response: `, aiResponse);
//     console.log(`Questions: `, question);

//     return res.status(200).json({
//       message: "Genereting first two question successfully",
//       question,
//     });
//   } catch (error) {
//     console.log("Error processing file:", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };

// const generateQuestions = async (req, res) => {
//   const file = req.file;

//   // check if file is present
//   if (!file) {
//     return res.status(400).json({ message: "File is required" });
//   }

//   try {
//     // Extract text from the resume
//     const resumeText = await parseFile(file.path, file.mimetype);
//     // Call the AI service to generate the first two questions
//     const aiResponse = await generatedQuestions(resumeText);

//     // Extract the questions from the response
//     const {
//       content: [{ text }],
//     } = aiResponse;

//     // Split the text into an array of questions
//     const question = text.split(/\n*\d+\.\s/).filter(Boolean);

//     // Store the  questions in the question array
//     question.forEach((q) => {
//       questions.push(q);
//     });

//     console.log(`Ai Response: `, aiResponse);
//     console.log(`Qestions: `, question);

//     return res.status(200).json({
//       message: "Genereting  questions successfully",
//       question,
//     });
//   } catch (error) {
//     console.log("Error processing file:", error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };

const generateQuestions = async (req, res, next) => {
  const file = req.file;
  const difficulty = req.params.difficulty;
  const jobDescription = req.body.jobDescription;

  try {
    // check if file is present
    if (!file) {
      // return res.status(400).json({ message: "File is required" });
      throw new CustomException("File is required", 400, "NoFileException");
    }

    // check if job description is present
    if (!jobDescription) {
      // return res.status(400).json({ message: "Job description is required" });
      throw new CustomException("Job description is required", 400, "NoJobDescriptionException");
    }

    // Extract text from the resume
    const resumeText = await parseFile(file.path, file.mimetype);
    // Call the AI service to generate the first two questions
    const aiResponse = await generatedQuestions(
      resumeText,
      difficulty,
      jobDescription
    );

    // Extract the questions from the response
    const {
      content: [{ text }],
    } = aiResponse;

    // Split the text into an array of questions
    // const question = text.split(/\n*\d+\.\s/).filter(Boolean);
    const question = text
      .split(/\n+/)
      .map((q) => q.replace(/^"|"$/g, ""))
      .filter(Boolean);

    // Store the  questions in the question array
    question.forEach((q) => {
      questions.push(q);
    });

    console.log(`Ai Response: `, aiResponse);
    console.log(`Difficulty: `, difficulty);
    console.log(`Questions: `, question);

    return res.status(200).json({
      message: "Genereting  questions successfully",
      question,
    });
  } catch (error) {
    next(error);
  }
};

const startMockInterview = async (req, res, next) => {
  try {
    const { question } = req.body;
    const videoFile = req.videoFile;

    if (!question) {
      throw new CustomException("Question is required", 400, "NoQuestionException");
    }

    if (!videoFile) {
      throw new CustomException("Video file is required", 400, "NoVideoFileException");
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
    next(error);
  }
};

// const getFeedback = (req, res) => {
//   try {
//     if (!feedbacks) {
//       return res.status(404).json({ message: "No feedback found" });
//     }
//     return res.status(200).json({ feedbacks });
//   } catch (error) {
//     console.log(`Error : ${error.message}`);
//     res
//       .status(500)
//       .json({ message: "Failed to get feedback", error: error.message });
//   }
// };

const generateOverAllFeedback = async (req, res) => {
  try {
    if (!answerAndQuestion || answerAndQuestion.length === 0) {
      return res.status(400).json({ message: "No feedback found" });
    }

    console.log("Answer and Question: ", answerAndQuestion);
    const response = await generatedOverAllFeedback(answerAndQuestion);

    const {
      content: [{ text }],
    } = response;

    // const feedbackObnject = parseFeedback(text);
    console.log("Feedback: ", text);
    // console.log("Feedback Object: ", feedbackObnject);
    console.log("Answer and Question: ", answerAndQuestion);
    console.log(`Ai Response: `, response);

    return res.status(200).json({
      message: "Feedback generated successfully",
      feedback: text,
    });
  } catch (error) {
    console.log("Error generating feedback:", error.message);
    return res.status(500).json({ message: error.message });
  } finally {
    answerAndQuestion = [];
  }
};

const getTextAudio = async (req, res) => {
  const { question } = req.body;
  try {
    const audioContent = await convertTextToAudio(question);
    res.json({ audio: audioContent });
  } catch (error) {
    res.status(500).json({ message: "Error converting text to audio" });
  }
};

module.exports = {
  // generateFirstQuestion,
  startMockInterview,
  // getFeedback,
  // generateFirstTwoQuestions,
  generateQuestions,
  generateOverAllFeedback,
  getTextAudio,
};
