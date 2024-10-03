require("dotenv").config();
const axios = require("axios");

const resumeFeedBack = async (resumeText, field) => {
  const aiApiUrl = "https://api.anthropic.com/v1/messages";
  const API_KEY = process.env.API_KEY; // Replace with actual API key

  const resolvedResumeText = await Promise.resolve(resumeText);
  const prompt = `Evaluate the following resume: ${resumeText} based on this job role ${field} and the criteria listed below. Provide a score from 1 to 10 for each category, and then give constructive feedback, identifying strengths and areas for improvement`;

  const data = {
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  try {
    const response = await axios.post(aiApiUrl, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in AI API request",
      error.response?.data || error.message || error
    );
    throw new Error("AI API request failed");
  }
};

const interviewAnswersFeeback = async (question, answer) => {
  const aiApiUrl = "https://api.anthropic.com/v1/messages";
  const API_KEY = process.env.API_KEY; // Replace with actual API key
  const prompt = `Given the following question: ${question} and answer: ${answer}, evaluate the answer in terms of its relevance, correctness, clarity, and depth. Provide a score from 1 to 10 for each category, and then give constructive feedback explaining what was done well and what can be improved.`;

  const data = {
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  try {
    const response = await axios.post(aiApiUrl, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in AI API request",
      error.response?.data || error.message || error
    );
    throw new Error("AI API request failed");
  }
};

module.exports = {
  resumeFeedBack,
  interviewAnswersFeeback,
};
