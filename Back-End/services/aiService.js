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
  const prompt = `
  You are tasked with evaluating the response to a question based on a video recording. 
  
  **Question:** ${question} 
  
  **Answer:** ${answer} 
  
  Please assess the answer according to the following criteria:
  1. **Relevance:** How well does the answer address the question?
  2. **Correctness:** Is the information provided accurate and factual?
  3. **Clarity:** Is the answer presented in a clear and understandable manner?
  4. **Depth:** Does the answer provide sufficient detail and insight?
  
  For each category, provide a score from 1 to 10, with 1 being poor and 10 being excellent. 
  
  After scoring, offer **constructive feedback** that highlights:
  - What aspects of the answer were done well.
  - Areas for improvement, including specific suggestions to enhance the relevance, correctness, clarity, or depth of the response.
  
  Make sure your evaluation is thorough and thoughtful, supporting your scores with clear reasoning.
  `;

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
