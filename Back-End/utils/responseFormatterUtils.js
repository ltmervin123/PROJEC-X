const formatResumeResponse = (aiResponse) => {
  return {
    suggestions: aiResponse.resume_suggestions,
    interviewQuestions: aiResponse.interview_questions,
  };
};

const formatInterviewResponse = (aiResponse) => {
  return {
    feedback: aiResponse.feedback,
    score: aiResponse.score,
  };
};

// Example: Basic formatting logic for AI response (customize based on your needs)
// const formatResponse = (aiResponse) => {
//   return {
//     suggestions: aiResponse.resume_suggestions.join("\n"),
//     interviewQuestions: aiResponse.interview_questions
//       .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
//       .join("\n\n"),
//   };
// };

// module.exports = {
//   formatResponse,
// };

module.exports = { formatResumeResponse, formatInterviewResponse };
