const { parseFile } = require("../services/extractResumeTextService");
const CustomException = require("../exception/customException");
const {
  generateQuestions: generatedQuestions,
  generateOverAllFeedback: generatedOverAllFeedback,
} = require("../services/aiService");
const Interview = require("../models/interviewModel");
const Question = require("../models/questionModel");
const {
  isGenerateMockQuestionValid,
  isGenerateBehaviorQuestionValid,
} = require("../utils/generateQuestionValidation");
const { formatQuestions } = require("../utils/formatterQuestionAndAnswerUtils");

const handleInterview = async (req, res, next) => {
  const { type } = req.body;

  switch (type) {
    case "Mock":
      return await mockInterview(req, res, next);

    case "Behavioral":
      return await behaviorInterview(req, res, next);

    default:
      throw new CustomException(
        "Invalid interview type",
        400,
        "InvalidTypeException"
      );
  }
};

const mockInterview = async (req, res, next) => {
  const { type, jobDescription, category, difficulty } = req.body;
  const file = req.file;
  const userId = req.user._id.toString();
  try {
    //Run all validations
    isGenerateMockQuestionValid(
      type,
      file,
      difficulty,
      jobDescription,
      category
    );

    // Extract text from the resume
    const resumeText = await parseFile(file.path, file.mimetype);

    //Fetch prevouis questions from interview document
    const hasPreviousQuestion = await Interview.getPreviousQuestions(
      userId,
      difficulty
    );

    // Check if there is a previous question and format it
    const prevQuestion =
      hasPreviousQuestion.length > 0
        ? formatQuestions(hasPreviousQuestion)
        : "No previous questions";

    console.log(`Previous Questions: `, prevQuestion);

    // Call the AI service to generate the first two questions
    const aiResponse = await generatedQuestions(
      resumeText,
      difficulty,
      jobDescription,
      prevQuestion // previous questions
    );

    console.log(`Ai Response: `, aiResponse);

    //Extract the questions from the response
    const {
      content: [{ text }],
    } = aiResponse;

    const parseQuestion = JSON.parse(text);
    const questions = parseQuestion.questions;

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

    return { questions, interviewId: interview._id };
  } catch (error) {
    next(error);
  }
};

const behaviorInterview = async (req, res, next) => {
  const { type, category } = req.body;
  const userId = req.user._id.toString();

  //Run all validations
  isGenerateBehaviorQuestionValid(type, category);

  //Fetc questions from the question document
  try {
    const questions = await Question.generateQuestions(category);

    //create a interview document initially with empty question and answer
    const interview = await Interview.createInterview(
      type,
      category,
      "N/A", // difficulty
      [],
      [],
      userId,
      "N/A" // jobDescription
    );

    return { questions, interviewId: interview._id };
  } catch (error) {
    next(error);
  }
};

module.exports = { handleInterview };
