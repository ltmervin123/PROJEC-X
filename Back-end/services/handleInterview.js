const { parseFile } = require("../services/extractResumeTextService");
const {
  generateQuestions: generatedQuestions,
} = require("../services/aiService");
const Interview = require("../models/interviewModel");
const Question = require("../models/questionModel");
const {
  isGenerateMockQuestionValid,
  isGenerateBehaviorQuestionValid,
} = require("../utils/generateQuestionValidation");
const { formatQuestions } = require("../utils/formatterQuestionAndAnswerUtils");
const { getSessionId } = require("../utils/generateSessionId");

const handleInterview = async (req, res, next) => {
  const { type } = req.body;

  if (!type) {
    throw new Error("Interview type is required");
  }

  //Run interview based on the type
  switch (type) {
    case "Mock":
      return await mockInterview(req, res, next);

    case "Behavioral":
      return await behaviorInterview(req, res, next);

    default:
      throw new Error("Invalid interview type");
  }
};

const mockInterview = async (req, res, next) => {
  //Extract the category from the request
  const { category } = req.body;
  if (!category) {
    throw new Error("Category is required");
  }
  //Run interview based on the category
  switch (category) {
    case "Basic":
      return await runBasicInterview(req, res, next);
    case "Expert":
      return await runExpertInterview(req, res, next);
  }
};

const runBasicInterview = async (req, res, next) => {
  const { type, category } = req.body;
  // const userId = getSessionId(req);
  const { userId, userName, userEmail } = req.user;
  //Run all validations
  isGenerateMockQuestionValid(type, null, null, category, userId);
  try {
    //Fetch prevouis questions from interview document
    const hasPreviousQuestion = await Interview.getPreviousQuestions(
      userId,
      category
    );

    // Check if there is a previous question and format it
    const prevQuestion =
      hasPreviousQuestion.length > 0
        ? formatQuestions(hasPreviousQuestion)
        : "No previous questions";

    // Run both the interview creation and question generation in parallel
    const [interview, aiResponse] = await Promise.all([
      Interview.createInterview(type, category, [], [], userId, "N/A"),
      generatedQuestions(null, category, null, prevQuestion),
    ]);

    //Extract the questions from the response
    const {
      content: [{ text }],
    } = aiResponse;

    const parseQuestion = JSON.parse(text);
    const questions = parseQuestion.questions;
    console.log(
      `${userId}-${userName}-${userEmail} is generating basic question`
    );
    return { questions, interviewId: interview._id };
  } catch (error) {
    next(error);
  }
};

const runExpertInterview = async (req, res, next) => {
  const { type, jobDescription, category } = req.body;
  const file = req.file;
  const { userId, userName, userEmail } = req.user;
  //Run all validations
  isGenerateMockQuestionValid(type, file, jobDescription, category);
  try {
    // Extract text from the resume and fetch previous questions from the interview document
    const [resumeText, hasPreviousQuestion] = await Promise.all([
      parseFile(file.path, file.mimetype),
      Interview.getPreviousQuestions(userId, category),
    ]);

    // Check if there is a previous question and format it
    const prevQuestion =
      hasPreviousQuestion.length > 0
        ? formatQuestions(hasPreviousQuestion)
        : "No previous questions";

    // Run both the interview creation and question generation in parallel
    const [interview, aiResponse] = await Promise.all([
      Interview.createInterview(type, category, [], [], userId, "N/A"),
      generatedQuestions(resumeText, category, resumeText, prevQuestion),
    ]);

    // console.log(`Ai Response: `, aiResponse);

    //Extract the questions from the response
    const {
      content: [{ text }],
    } = aiResponse;

    const parseQuestion = JSON.parse(text);
    const questions = parseQuestion.questions;
    console.log(
      `${userId}-${userName}-${userEmail} is generating expert question`
    );

    return { questions, interviewId: interview._id };
  } catch (error) {
    next(error);
  }
};

const behaviorInterview = async (req, res, next) => {
  const { type, category } = req.body;
  const { userId, userName, userEmail } = req.user;
  //Run all validations
  isGenerateBehaviorQuestionValid(type, category);

  //Fetc random 5 questions from the question document
  try {
    // Run both the question generation and interview creation in parallel
    const [questions, interview] = await Promise.all([
      Question.generateQuestions(category),
      Interview.createInterview(type, category, [], [], userId, "N/A"),
    ]);
    console.log(
      `${userId}-${userName}-${userEmail} is generating behavior question`
    );
    return { questions, interviewId: interview._id };
  } catch (error) {
    next(error);
  }
};
module.exports = { handleInterview };
