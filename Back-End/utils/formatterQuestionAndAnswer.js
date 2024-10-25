const formatQuestionAndAnswer = (answerAndQuestion) => {
  return answerAndQuestion
    .map(
      (item, index) =>
        `Q${index + 1}: ${item.Question}\nA${index + 1}: ${item.Answer}`
    )
    .join("\n\n");
};

module.exports = {formatQuestionAndAnswer};