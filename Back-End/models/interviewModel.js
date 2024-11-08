const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
  category: {
    type: String,
    required: true,
  },

  question: {
    type: Array,
    required: true,
  },
  answer: {
    type: Array,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobDescription: {
    type: String,
    required: false,
  },
}
,{
    timestamps: true,
});

module.exports = mongoose.model("Interview", interviewSchema);