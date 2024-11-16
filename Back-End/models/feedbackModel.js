const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    feedback: {
      type: Array,
      required: true,
    },
    overallFeedback: {
      grammar: {
        type: String, // Changed to String
        required: true,
        trim: true, // Optional: Removes extra spaces
      },
      gkills: {
        type: String, // Changed to String
        required: true,
        trim: true,
      },
      experience: {
        type: String, // Changed to String
        required: true,
        trim: true,
      },
      relevance: {
        type: String, // Changed to String
        required: true,
        trim: true,
      },
      fillerCount: {
        type: String, // Changed to String
        required: true,
        trim: true,
      },
      overallPerformance: {
        type: String, // Changed to String
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
//Static method to create feedback
feedbackSchema.statics.createFeedback = async function (feedbackData) {
  // Validate the feedback data
  if (
    !feedbackData.userId ||
    !feedbackData.interviewId ||
    !feedbackData.feedback ||
    !feedbackData.overallFeedback
  ) {
    throw new Error("Invalid feedback data");
  }

  // Create a new feedback
  const feedback = await this.create({
    userId: feedbackData.userId,
    interviewId: feedbackData.interviewId,
    feedback: feedbackData.feedback,
    overallFeedback: {
      grammar: feedbackData.overallFeedback.grammar,
      gkills: feedbackData.overallFeedback.gkills,
      experience: feedbackData.overallFeedback.experience,
      relevance: feedbackData.overallFeedback.relevance,
      fillerCount: feedbackData.overallFeedback.fillerCount,
      overallPerformance: feedbackData.overallFeedback.overallPerformance,
    },
  });

  if (!feedback) {
    throw new Error("Error occurred while creating feedback");
  }

  // Return the feedback
  return feedback;
};

feedbackSchema.statics.getFeedbackByUserId = async function (userId) {
  const feedback = await this.aggregate([
    { $match: { userId: userId } },
    {
      $lookup: {
        from: "interviews",
        localField: "interviewId",
        foreignField: "_id",
        as: "interviewDetails",
      },
    },
  ]);

  if (!feedback) {
    throw new Error("Feedback not found");
  }

  return feedback;
};

//Export the model
module.exports = mongoose.model("Feedback", feedbackSchema);
