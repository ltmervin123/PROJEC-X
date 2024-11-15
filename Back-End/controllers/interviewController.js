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
const Interview = require("../models/interviewModel");
const {
  isGenerateQuestionValid,
} = require("../utils/generateQuestionValidation");
const { isValidVideo } = require("../utils/videoValidation");

const generateQuestions = async (req, res, next) => {
  const file = req.file;
  const { type, jobDescription, category, difficulty } = req.body;
  const userId = req.user._id;

  try {
    //Run all validations
    isGenerateQuestionValid(type, file, difficulty, jobDescription, category);

    //create a interview document initially with empty question and answer
    const interview = await Interview.createInterview(
      type,
      category,
      difficulty,
      [],
      [],
      userId,
      jobDescription
    );

    // Extract text from the resume
    const resumeText = await parseFile(file.path, file.mimetype);

    // Call the AI service to generate the first two questions
    const aiResponse = await generatedQuestions(
      resumeText,
      difficulty,
      jobDescription
    );

    //Extract the questions from the response
    const {
      content: [{ text }],
    } = aiResponse;

    const parseQuestion = JSON.parse(text);
    const questions = parseQuestion.questions;

    console.log(`Ai Response: `, aiResponse);

    // Return questions and interview id
    return res.status(200).json({
      message: "Genereting  questions successfully",
      questions,
      interviewId: interview._id,
    });
  } catch (error) {
    next(error);
  }
};

const startMockInterview = async (req, res, next) => {
  try {
    // Extract the user id from the request
    const { userId } = req.user._id;

    // Extract the interview id and question from the request
    const { interviewId, question } = req.body;

    // Path to the uploaded video file
    const videoPath = path.resolve(req.file.path);

    // Validate the video file
    isValidVideo(question, videoPath, interviewId);

    // extracted text from the video as answer
    const answer = await processVideoFile(videoPath);

    // Store the question and answer on the interview document along with the interview id and user id
    const interview = await Interview.addQuestionAndAnswer(
      interviewId,
      question,
      answer
    );

    //Store question and answer on the interview document along with the interview id and user id
    console.log(`Answer : ${answer}`);
    return res
      .status(200)
      .json({ message: "Video processed successfully", interview });
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

const getTextAudio = async (req, res, next) => {
  const { question } = req.body;
  try {
    const audioContent = await convertTextToAudio(question);
    res.json({ audio: audioContent });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startMockInterview,
  generateQuestions,
  generateOverAllFeedback,
  getTextAudio,
};
