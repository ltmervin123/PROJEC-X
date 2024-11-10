const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interviewSchema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: "User",
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
  category,
  difficulty,
  question,
  answer,
  userId,
  jobDescription
) {
  const interview = await this.create({
    category,
    difficulty,
    question,
    answer,
    userId,
    jobDescription,
  });

  return interview;
};

module.exports = mongoose.model("Interview", interviewSchema);
