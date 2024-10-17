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
  const prompt = `You are an interviewer . 
  Question: ${question}/n
  Answer: ${answer}/n

  You are tasked with following:
  
  1. Assess the recorded answer focusing on the following criteria: Grammatical Errors. Punctuation. Context. Relevance to the question.
  2. Analyze the answer based on the criterion.
  3. Using the analysis (#2), generate a friendly suggestion on how to improve.
  4. Give only the overall assessment based on the analysis and the suggestion and in a paragraph form. (Max 100 words)
  5. Omit the 'Overall Assessment' and give the assessment as if youre giving the interview in person.`;

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
