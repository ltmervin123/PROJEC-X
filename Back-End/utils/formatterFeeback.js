const parseFeedback = (feedback) => {
  const feedbackData = {};

  // Define regular expressions for each part
  const scorePattern = /Overall Score:\s*([\d.]+)(?=\/10)/;
  const feedbackPattern = /Feedback:\n([\s\S]*?)(?=\n\nComments:)/;
  const commentsPattern = /Comments:\n([\s\S]*)/;

  // Extract using regex patterns
  const scoreMatch = feedback.match(scorePattern);
  const feedbackMatch = feedback.match(feedbackPattern);
  const commentsMatch = feedback.match(commentsPattern);

  // Assign values to the feedbackData object
  feedbackData.overallScore = scoreMatch ? scoreMatch[1].trim() : null;
  feedbackData.feedback = feedbackMatch ? feedbackMatch[1].trim() : null;
  feedbackData.comments = commentsMatch
    ? commentsMatch[1]
        .trim()
        .split("\n")
        .map((comment) => comment.replace(/^- /, "").trim())
    : [];

  return feedbackData;
};

const resumeFeedbackFormatter = (feedback) => {
  const feedbackData = {};

  // Define regular expressions for each part
  const scorePattern = /Overall Score:\s*([\d.]+\/10\.0)/;
  const marketStrengthPattern =
    /Market Strength:\s*([\s\S]*?)(?=\n\s*Areas for Improvement:)/;
  const areasForImprovementPattern = /Areas for Improvement:\s*([\s\S]*)/;

  // Extract using regex patterns 
  const scoreMatch = feedback.match(scorePattern);
  const marketStrengthMatch = feedback.match(marketStrengthPattern);
  const areasForImprovementMatch = feedback.match(areasForImprovementPattern);

  // Assign values to the feedbackData object
  feedbackData.score = scoreMatch ? scoreMatch[1].trim() : null;
  feedbackData.marketStrength = marketStrengthMatch
    ? marketStrengthMatch[1].replace(/\\n'\s\+\s'\\n/g, "").trim()
    : null;
  feedbackData.areasForImprovement = areasForImprovementMatch
    ? areasForImprovementMatch[1].trim()
    : null;

  return feedbackData;
};

module.exports = { parseFeedback, resumeFeedbackFormatter };
