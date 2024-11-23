const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CustomException = require("../exception/customException");
const { sanitizeData } = require("../utils/dataSanitization");
const interviewSchema = new Schema(
  {
    type: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    question: {
      type: Array,
      required: false,
    },
    answer: {
      type: Array,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.statics.createInterview = async function (
  type,
  category,
  question,
  answer,
  userId,
  jobDescription
) {
  // Create a new interview
  const interview = await this.create({
    type,
    category,
    question,
    answer,
    userId,
    jobDescription,
  });

  // Return the interview
  return interview;
};

interviewSchema.statics.addQuestionAndAnswer = async function (
  interviewId,
  question,
  answer
) {
  // Find the interview by id
  const interview = await this.findById(interviewId);

  if (!interview) {
    throw new CustomException(
      "No interview found",
      400,
      "NoInterviewException"
    );
  }
  // Sanitize the data
  sanitizedQuestion = sanitizeData(question);
  sanitizedAnswer = sanitizeData(answer);

  // Add the question and answer to the interview
  interview.question.push(sanitizedQuestion);
  interview.answer.push(sanitizedAnswer);

  // Save the interview
  await interview.save();
  // Return the interview
  return interview;
};

//Static method to get interview question, answer and userId by interview id
interviewSchema.statics.getInterviewById = async function (interviewId) {
  // Find the interview by id
  const interview = await this.findById(interviewId);

  if (!interview) {
    throw new CustomException(
      "No interview found",
      400,
      "NoInterviewException"
    );
  }
  // Return the interview
  return interview;
};

//Static method to get previous questions from the interview document by userId
interviewSchema.statics.getPreviousQuestions = async function (
  userId,
  category
) {
  // Find the most recent interview matching the userId and difficulty level
  const interview = await this.find({ userId, category })
    .sort({ createdAt: -1 }) // Sort by creation date in descending order
    .limit(5)
    .select("question") // Project only the 'question' field
    .exec();

  if (!interview) {
    return [];
  }

  // Combine all questions into a single array
  const allQuestions = interview.reduce((acc, interview) => {
    return acc.concat(interview.question); // Merge each record's questions into the accumulator
  }, []);

  // Return the interview
  return allQuestions;
};

module.exports = mongoose.model("Interview", interviewSchema);
