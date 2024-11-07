const formatQuestionAndAnswer = (answerAndQuestion) => {
  return answerAndQuestion
    .map(
      (item, index) =>
        `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`
    )
    .join("\n\n");
};

module.exports = {formatQuestionAndAnswer};