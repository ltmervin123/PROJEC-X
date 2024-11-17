const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Question schema
const questionSchema = new Schema({
  // Unique identifier for the question document
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Automatically generate _id if not provided
  },
  // Category of the questions (e.g., "Adaptability")
  category: {
    type: String,
    required: true, // Ensure category is always provided
    trim: true, // Remove extra whitespace
  },
  // Array of questions
  questions: {
    type: [String], // Array of strings
    validate: {
      validator: function (value) {
        return Array.isArray(value) && value.length > 0;
      },
      message: "Questions array must contain at least one question.",
    },
    required: true, // Ensure questions array is provided
  },
});

questionSchema.statics.generateQuestions = async function (category) {
  // Find one document that matches the category
  const document = await this.findOne({ category })
    .select("questions -_id")
    .exec();

  if (!document) {
    //Log error message
    console.error(`No questions found for category: ${category}`);
    return [];
  }

  // Shuffle the questions array
  const shuffledQuestions = document.questions.sort(() => Math.random() - 0.5);

  // Return the first 3 questions from the shuffled array
  return shuffledQuestions.slice(0, 3);
};

// Export the model
module.exports = mongoose.model("Question", questionSchema);
