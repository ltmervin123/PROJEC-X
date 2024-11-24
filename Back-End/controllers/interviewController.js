const path = require("path");
const { processVideoFile } = require("../services/videoToTextService");
const { convertTextToAudio } = require("../services/textToAudioService");
const CustomException = require("../exception/customException");
const {
  generateOverAllFeedback: generatedOverAllFeedback,
} = require("../services/aiService");
const Interview = require("../models/interviewModel");
const { isValidVideo } = require("../utils/videoValidation");
const {
  formatQuestionAndAnswer,
} = require("../utils/formatterQuestionAndAnswerUtils");
const Feedback = require("../models/feedbackModel");
const { handleInterview } = require("../services/handleInterview");
const { getSessionId } = require("../utils/generateSessionId");

const generateQuestions = async (req, res, next) => {
  try {
    // Call the handleInterview function to generate the questions
    const interview = await handleInterview(req, res, next);
    const { questions, interviewId } = await interview;
    // Return questions and interview id
    return res.status(200).json({
      message: "Genereting  questions successfully",
      questions,
      interviewId,
    });
  } catch (error) {
    console.log("Error generating questions:", error.message);
    next(error);
  }
};

const startMockInterview = async (req, res, next) => {
  try {
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
    return res
      .status(200)
      .json({ message: "Video processed successfully", interview });
  } catch (error) {
    console.log("Error processing video:", error.message);
    next(error);
  }
};

const createOverallFeedback = async (req, res, next) => {
  const interviewId = req.body.interviewId;
  const sessionId = getSessionId(req);
  // Validate the interview id
  if (!interviewId) {
    throw new CustomException(
      "Interview Id is required",
      400,
      "InterviewIdRequiredException"
    );
  }

  // Validate the user id
  if (!sessionId) {
    throw new CustomException(
      "User Id is required",
      400,
      "UserIdRequiredException"
    );
  }
  
  try {
    // Get interview by id
    const interview = await Interview.getInterviewById(interviewId);

    //Format the question and answer
    const formattedData = formatQuestionAndAnswer(
      interview.question,
      interview.answer
    );

    // Call the AI service to generate the overall feedback
    const aiResponse = await generatedOverAllFeedback(formattedData);

    console.log("AI Response:", aiResponse);

    // Extract the feedback from the response
    const aiFeedback = aiResponse.content[0].text;

    // Parse the feedback
    const parseFeedback = JSON.parse(aiFeedback);

    // Create a feedback object
    const feedbackObject = {
      sessionId,
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
      improvedAnswer: parseFeedback.improvedAnswer,
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
  if (!question) {
    throw new CustomException(
      "Question is required",
      400,
      "QuestionRequiredException"
    );
  }
  try {
    const audioContent = await convertTextToAudio(question);
    res.json({ audio: audioContent });
  } catch (error) {
    console.log("Error Converting Text to Audio:", error.message);
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  const sessionId = getSessionId(req);

  if (!sessionId) {
    throw new CustomException(
      "User Id is required",
      400,
      "UserIdRequiredException"
    );
  }
  try {
    const feedback = await Feedback.getFeedbackByUserId(sessionId);
    res.status(200).json({ feedback });
  } catch (error) {
    console.log("Error fetching feedback:", error.message);
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
