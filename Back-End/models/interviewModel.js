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

    difficulty: {
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
  difficulty,
  question,
  answer,
  userId,
  jobDescription
) {
  // Create a new interview
  const interview = await this.create({
    type,
    category,
    difficulty,
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

module.exports = mongoose.model("Interview", interviewSchema);
