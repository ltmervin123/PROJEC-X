
//Function that retun a string with the questions and answers formatted
const formatQuestionAndAnswer = (question, answer) => {
  if (question.length !== answer.length) {
    throw new Error("Questions and answers arrays must have the same length.");
  }

  return question
    .map((question, index) =>
      answer[index]
        ? `Question ${index}: ${question}\nAnswer: ${answer[index]}`
        : `Question ${index}: ${question}\nAnswer: No answer provided`
    )
    .join("\n\n");
};

const formatQuestions = (questions) => {
  if (questions.length === 0) {
    throw new Error("Questions are required");
  }
  return questions
    .map((question, index) => `Question ${index}: ${question}`)
    .join("\n");
};

module.exports = { formatQuestionAndAnswer, formatQuestions };
