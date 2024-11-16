const { parseFile } = require("../services/extractResumeTextService");
const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
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
const {
  formatQuestionAndAnswer,
} = require("../utils/formatterQuestionAndAnswerUtils");
const Feedback = require("../models/feedbackModel");

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

const createOverallFeedback = async (req, res, next) => {
  const interviewId = req.body.interviewId;
  console.log("Interview Id: ", interviewId);
  const userId = req.user._id;
  try {
    // Validate the interview id
    if (!interviewId) {
      throw new CustomException(
        "Interview Id is required",
        400,
        "InterviewIdRequiredException"
      );
    }

    // Validate the user id
    if (!userId) {
      throw new CustomException(
        "User Id is required",
        400,
        "UserIdRequiredException"
      );
    }

    // Get interview by id
    const interview = await Interview.getInterviewById(interviewId);

    //Format the question and answer
    const formattedData = formatQuestionAndAnswer(
      interview.question,
      interview.answer
    );

    // Call the AI service to generate the overall feedback
    const aiResponse = await generatedOverAllFeedback(formattedData);

    // Extract the feedback from the response
    const aiFeedback = aiResponse.content[0].text;

    // Parse the feedback
    const parseFeedback = JSON.parse(aiFeedback);

    // Create a feedback object
    const feedbackObject = {
      userId,
      interviewId: interview._id,
      feedback: parseFeedback.questionsFeedback,
      overallFeedback: {
        grammar: parseFeedback.criteriaScores[0].score,
        gkills: parseFeedback.criteriaScores[1].score,
        experience: parseFeedback.criteriaScores[2].score,
        relevance: parseFeedback.criteriaScores[3].score,
        fillerCount: parseFeedback.criteriaScores[4].score,
        overallPerformance: parseFeedback.criteriaScores[5].score,
      },
    };

    // Create a new feedback document
    const feedback = await Feedback.createFeedback(feedbackObject);

    if (!feedback) {
      throw new CustomException(
        "Feedback not created",
        400,
        "FeedbackNotCreatedException"
      );
    }

    console.log(`\nRetrieved Interview: `, interview);
    console.log(`Questions: `, interview.question);
    console.log(`Answers: `, interview.answer);
    console.log(`Formatted Data: `, formattedData);
    console.log(`AI Feedback: `, aiFeedback);

    return res.status(200).json({
      message: "Feedback generated successfully",
    });
  } catch (error) {
    console.log("Error generating feedback:", error.message);
    next(error);
  }
};

const getTextAudio = async (req, res, next) => {
  const { question } = req.body;
  try {
    const audioContent = await convertTextToAudio(question);
    res.json({ audio: audioContent });
  } catch (error) {
    console.log("Error fetching feedback:", error.message);
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  let userId = req.user._id.toString();

  if (!userId) {
    throw new CustomException(
      "User Id is required",
      400,
      "UserIdRequiredException"
    );
  }

  try {
    const feedback = await Feedback.getFeedbackByUserId(userId);
    console.log(`Feedback: `, feedback);
    res.status(200).json({ feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startMockInterview,
  generateQuestions,
  createOverallFeedback,
  getTextAudio,
  getFeedback,
};
