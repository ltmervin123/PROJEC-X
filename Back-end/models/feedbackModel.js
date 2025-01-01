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
      skill: {
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
      fillers: {
        type: String, // Changed to String
        required: true,
        trim: true,
      },
      list: {
        type: [String],
        required: true,
        trim: true,
      },
    },
    improvedAnswer: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//Static method to create feedback
feedbackSchema.statics.createFeedback = async function (feedbackData) {
  if (
    !feedbackData.userId ||
    !feedbackData.interviewId ||
    !feedbackData.feedback ||
    !feedbackData.overallFeedback ||
    !feedbackData.improvedAnswer
  ) {
    throw new Error("Invalid feedback data");
  }

  try {
    // Create a new feedback
    const feedback = await this.create({
      userId: feedbackData.userId,
      interviewId: feedbackData.interviewId,
      feedback: feedbackData.feedback,
      overallFeedback: {
        grammar: feedbackData.overallFeedback.grammar,
        skill: feedbackData.overallFeedback.skill,
        experience: feedbackData.overallFeedback.experience,
        relevance: feedbackData.overallFeedback.relevance,
        fillerCount: feedbackData.overallFeedback.fillerCount,
        overallPerformance: feedbackData.overallFeedback.overallPerformance,
        fillers: feedbackData.overallFeedback.fillerList,
        list: feedbackData.overallFeedback.list,
      },
      improvedAnswer: feedbackData.improvedAnswer,
    });

    if (!feedback) {
      throw new Error("Error occurred while inserting feedback");
    }

    // Return the feedback
    return feedback;
  } catch (error) {
    throw new Error(
      "Data base error while inserting feedback " + error.message
    );
  }
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
