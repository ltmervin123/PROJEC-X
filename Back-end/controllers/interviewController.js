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

    if (!interview) {
      throw new CustomException(
        "An error occured while generating questions",
        400,
        "GeneratingQuestionsException"
      );
    }

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
    const { userId, userName, userEmail } = req.user;
    // Extract the interview id and question from the request
    const { interviewId, question } = req.body;

    // Path to the uploaded video file
    const videoPath = path.resolve(req.file.path);

    // Validate the video file
    isValidVideo(question, videoPath, interviewId);

    // extracted text from the video as answer
    const answer = await processVideoFile(videoPath, interviewId);

    // Store the question and answer on the interview document along with the interview id and user id
    const interview = await Interview.addQuestionAndAnswer(
      interviewId,
      question,
      answer
    );

    // thorw an error if interview is not created
    if (!interview) {
      throw new CustomException(
        "An error occured while uploading your answer",
        400,
        "UploadingAnswerException"
      );
    }

    // Log the user that started the interview
    console.log(`${userId}-${userName}-${userEmail} is answering question`);
    //Store question and answer on the interview document along with the interview id and user id
    return res
      .status(200)
      .json({ message: "Video processed successfully", interview });
  } catch (error) {
    console.log(error);
    console.log("Error processing video:", error.message);
    next(error);
  }
};

const createOverallFeedback = async (req, res, next) => {
  try {
    const interviewId = req.body.interviewId;
    const { userId, userName, userEmail } = req.user;
    // Validate the interview id
    if (!interviewId) {
      throw new error("Interview Id is required");
    }

    // Validate the user id
    if (!userId) {
      throw new error("User Id is required");
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
      userId: userId,
      interviewId: interview._id,
      feedback: parseFeedback.questionsFeedback,
      overallFeedback: {
        grammar: parseFeedback.criteriaScores[0].score,
        gkills: parseFeedback.criteriaScores[1].score,
        experience: parseFeedback.criteriaScores[2].score,
        relevance: parseFeedback.criteriaScores[3].score,
        fillerCount: parseFeedback.criteriaScores[4].score,
        overallPerformance: parseFeedback.criteriaScores[5].score,
        fillerList: parseFeedback.criteriaScores[6].FillerList,
        list: parseFeedback.criteriaScores[6].list,
      },
      improvedAnswer: parseFeedback.improvedAnswer,
    };

    // Create a new feedback document
    const feedback = await Feedback.createFeedback(feedbackObject);

    if (!feedback) {
      console.log("An error occured while creating feedback");
      throw new CustomException(
        "Feedback not created",
        400,
        "FeedbackNotCreatedException"
      );
    }

    console.log(`${userId}-${userName}-${userEmail} is generating feedback`);

    return res.status(200).json({
      message: "Feedback generated successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Error generating feedback:", error.message);
    next(error);
  }
};

const getTextAudio = async (req, res, next) => {
  const { text } = req.body;

  try {
    if (!text) {
      throw new error("Text is required");
    }
    const audioContent = await convertTextToAudio(text);

    if (!audioContent) {
      throw new CustomException(
        "An error occured while converting text to audio",
        400,
        "ConvertingTextToAudioException"
      );
    }

    res.json({ audio: audioContent });
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  // const userId = getSessionId(req);
  const { userId, userName } = req.user;

  if (!userId) {
    throw new CustomException(
      "User Id is required",
      400,
      "UserIdRequiredException"
    );
  }
  try {
    const feedback = await Feedback.getFeedbackByUserId(userId);
    console.log(`${userId}-${userName} is fetching feedback`);
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
