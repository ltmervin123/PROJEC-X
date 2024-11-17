const { parseFile } = require("../services/extractResumeTextService");
const CustomException = require("../exception/customException");
const {
  generateQuestions: generatedQuestions,
  generateOverAllFeedback: generatedOverAllFeedback,
} = require("../services/aiService");
const Interview = require("../models/interviewModel");
const {
  isGenerateQuestionValid,
} = require("../utils/generateQuestionValidation");
const { formatQuestions } = require("../utils/formatterQuestionAndAnswerUtils");

const handleInterview = async (req, res, next) => {
  const { type } = req.body;
  if (type === "Mock") {
    return await mockInterview(req, res, next);
  } else if (type === "Behavior") {
    await behaviorInterview(req, res, next);
  } else {
    throw new CustomException("Invalid interview type", 400);
  }
};

const mockInterview = async (req, res, next) => {
  const { type, jobDescription, category, difficulty } = req.body;
  const file = req.file;
  const userId = req.user._id.toString();
  try {
    //Run all validations
    isGenerateQuestionValid(type, file, difficulty, jobDescription, category);

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

const behaviorInterview = () => {};

module.exports = { handleInterview };
