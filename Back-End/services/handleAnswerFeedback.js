const { interviewAnswersFeeback } = require("./aiService");
const {processVideoFile} = require("./extractVideoToText");

const handleAnswerFeedback = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Question and answer are required" });
  }

  try {
    // Send interview answer to AI API
    const aiResponse = await interviewAnswersFeeback(question, answer);

    // Process AI response (feedback on the answer)
    const formattedResponse = formatResponse(aiResponse);

    res.json({
      message: "Answer processed successfully",
      result: formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const formatResponse = (aiResponse) => {
  return {
    feedback: aiResponse.feedback,
    score: aiResponse.score,
  };
};
