const formatQuestionAndAnswer = (question, answer) => {
  console.log(`Question length: ${question.length}`);
  console.log(`Answer length: ${answer.length}`);
  
  if (question.length !== answer.length) {
    throw new Error("Questions and answers arrays must have the same length.");
  }

  return question
    .map((question, index) => `Question: ${question}\nAnswer: ${answer[index]}`)
    .join("\n\n");
};

module.exports = { formatQuestionAndAnswer };
