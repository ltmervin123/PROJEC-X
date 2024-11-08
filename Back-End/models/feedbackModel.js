const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const overAllFeedbackSchema = new Schema(
  {
    overAllPerformance: {
      type: String,
      required: true,
    },
    grammar: {
      type: String,
      required: true,
    },
    pronounciation: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Feedback: mongoose.model("Feedback", feedbackSchema),
  OverAllFeedback: mongoose.model("OverAllFeedback", overAllFeedbackSchema),
};
