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
  // Call the handleInterview function to generate the questions
  const interview = await handleInterview(req, res, next);
  const { questions, interviewId } = interview;
  // Return questions and interview id
  return res.status(200).json({
    message: "Genereting  questions successfully",
    questions,
    interviewId,
  });
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
    next(error);
  }
};

const createOverallFeedback = async (req, res, next) => {
  const interviewId = req.body.interviewId;

  const sessionId = getSessionId(req);
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

    console.log("Parsed feedback:", parseFeedback);
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
      areasForImprovement: parseFeedback.areasForImprovement,
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
  try {
    const audioContent = await convertTextToAudio(question);
    res.json({ audio: audioContent });
  } catch (error) {
    console.log("Error fetching feedback:", error.message);
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  const sessionId = getSessionId(req);

  if (!userId) {
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
