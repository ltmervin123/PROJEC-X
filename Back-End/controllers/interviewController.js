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
  generateQuestions: generatedQuestions,
  generateOverAllFeedback: generatedOverAllFeedback,
} = require("../services/aiService");

const generateQuestions = async (req, res, next) => {
  const file = req.file;
  const difficulty = req.params.difficulty;
  const jobDescription = req.body.jobDescription;

  try {
    // check if file is present
    if (!file) {
      throw new CustomException("Resume is required", 400, "NoResumeException");
    }

    // check if job description is present
    if (!jobDescription) {
      throw new CustomException(
        "Job description is required",
        400,
        "NoJobDescriptionException"
      );
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

    const parseQuestion = JSON.parse(text);
    const questions = parseQuestion.questions;

    console.log(`Ai Response: `, aiResponse);
    console.log(`Difficulty: `, difficulty);
    console.log(`Questions: `, questions);


    return res.status(200).json({
      message: "Genereting  questions successfully",
      questions,
    });
  } catch (error) {
    next(error);
  }
};

const startMockInterview = async (req, res, next) => {
  try {
    const { question } = req.body;
    // Path to the uploaded video file
    const videoPath = path.resolve(req.file.path);

    if (!question) {
      throw new CustomException(
        "Question is required",
        400,
        "NoQuestionException"
      );
    }

    if (!videoPath) {
      throw new CustomException(
        "Video file is required",
        400,
        "NoVideoFileException"
      );
    }

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

const generateOverAllFeedback = async (req, res) => {
  try {
    if (!answerAndQuestion || answerAndQuestion.length === 0) {
      throw new CustomException(
        "No answer and question found",
        400,
        "NoAnswerAndQuestionException"
      );
    }

    console.log("Answer and Question: ", answerAndQuestion);
    const response = await generatedOverAllFeedback(answerAndQuestion);

    const {
      content: [{ text }],
    } = response;

    console.log(`Ai Response: `, response);
    console.log(`Text: `, text);

    const feedbackObject = JSON.parse(text);

    console.log("Feedback: ", feedbackObject);
    // Return the formatted JSON string with indentation for readability
    return res.status(200).json({
      message: "Feedback generated successfully",
      feedback: feedbackObject,
    });
  } catch (error) {
    console.log("Error generating feedback:", error.message);
    next(error);
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
  startMockInterview,
  generateQuestions,
  generateOverAllFeedback,
  getTextAudio,
};
