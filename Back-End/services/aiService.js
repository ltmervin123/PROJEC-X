const { URL, API_KEY } = require("../constant/aiServiceConstant");
const axios = require("axios");

const setData = (prompt) => {
  return {
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
};

const resumeFeedBack = async (resumeText, field) => {
  const prompt = `Evaluate the following resume: ${resumeText} based on this job role ${field} and the criteria listed below. Provide a score from 1 to 10 for each category, and then give constructive feedback, identifying strengths and areas for improvement`;

  const data = setData(prompt);

  try {
    const response = await axios.post(URL, data, {
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
  const prompt = `
  Complete the designated task in a numerical order:
  Question: ${question}
  Answer: ${answer}
  1. Task 1: Briefly analyze the Answer base on the Question, suggest friendly improvements.
  2. Task 2: Generate a friendly feedback based on Task 1.
  3. Task 3: Present the feedback as if you're speaking to them in person.
  
  Important Rules:
  Do not show the analysis and the suggestions. Only the feedback.
  The feedback should be presented in paragraph form; maximum 100 word limit.
  `;
  const data = setData(prompt);

  try {
    const response = await axios.post(URL, data, {
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

const generateFirstQuestion = async (resumeText) => {
  const prompt = `Based on this resume: ${resumeText}, generate only one interview question without any additional explanation or context. Respond with just the question.`;

  const data = setData(prompt);

  try {
    const response = await axios.post(URL, data, {
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

const generateFollowUpQuestion = async (answer) => {
  const prompt = `Based on this answer: ${answer}, generate a follow-up question that would be appropriate in an interview setting. Respond with just the question.`;

  const data = setData(prompt);
  try {
    const response = await axios.post(URL, data, {
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
  generateFirstQuestion,
  generateFollowUpQuestion,
};
