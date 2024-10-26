const { URL, API_KEY } = require("../constant/aiServiceConstant");
const axios = require("axios");
const {
  formatQuestionAndAnswer,
} = require("../utils/formatterQuestionAndAnswer");

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
  // const prompt = `Evaluate the following resume: ${resumeText} based on this job role ${field} and the criteria listed below. Provide a score from 1 to 10 for each category, and then give constructive feedback, identifying strengths and areas for improvement`;
  const prompt = `Rate this resume: ${resumeText} for ${field}. Score 1-10 for each category. Give brief feedback on strengths and improvements.`;

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
    throw new Error("An error occurred while processing the resume");
  }
};

// Complete the designated task in a numerical order:
// 1. Task 1: Briefly analyze answer, suggest friendly improvements.
// 2. Task 2: Generate a friendly feedback based on Task 1.
// 3. Task 3: Present the feedback as if you're speaking to them in person.

// Important Rules:
// Do not show the analysis and the suggestions. Only the feedback.
// The feedback should be presented in paragraph form; maximum 100 word limit.

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
    throw new Error("An error occurred while processing the answer");
  }
};

const generateFirstQuestion = async (resumeText) => {
  const prompt = `Based on this resume: ${resumeText}, generate one random interview question without any additional explanation or context. Respond with just the question.`;

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
      "Generating first question failed",
      error.response?.data || error.message || error
    );
    throw new Error("An error occurred while generating the first question");
  }
};

const generateFirstTwoQuestions = async (resumeText) => {
  const prompt = `Based on this resume: ${resumeText}, generate two random interview questions without any additional explanation or context. Respond with just the question.`;

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
      "Generating first two questions failed",
      error.response?.data || error.message || error
    );
    throw new Error(
      "An error occurred while generating the first two question"
    );
  }
};

const generateQuestions = async (resumeText) => {
  const prompt = `Based on this resume: ${resumeText}, generate three random interview questions without any additional explanation or context. Respond with just the question.`;

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
      "Generating  questions failed",
      error.response?.data || error.message || error
    );
    throw new Error("An error occurred while generating question");
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
    throw new Error("An error occurred while generating follow-up question");
  }
};

// const generateOverAllFeedback = async (answerAndQuestion) => {
//   const prompt = `Base on the Answer and Question ${answerAndQuestion} complete the designated task in a numerical order:
//   1. Task 1: Briefly analyze answer, suggest friendly improvements.
//   2. Task 2: Generate a friendly feedback based on Task 1.
//   3. Task 3: Present the feedback as if you're speaking to them in person.

//   Important Rules:
//   Do not show the analysis and the suggestions. Only the feedback.
//   The feedback should be presented in paragraph form; maximum 100 word limit.`;
//   const data = setData(prompt);
//   try {
//     const response = await axios.post(URL, data, {
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": API_KEY,
//         "anthropic-version": "2023-06-01",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Generating  over all feedbacks failed",
//       error.response?.data || error.message || error
//     );
//     throw new Error("An error occurred while generating over all feedback");
//   }
// };
const generateOverAllFeedback = async (answerAndQuestion) => {
  // Format each question-answer pair
  const formattedQnA = formatQuestionAndAnswer(answerAndQuestion);

  // const prompt = `Based on the following Questions and Answers:\n\n${formattedQnA}\n\nComplete the designated tasks in numerical order:

  // 1. Task 1: Briefly analyze each answer and suggest friendly improvements.
  // 2. Task 2: Generate friendly feedback based on Task 1.
  // 3. Task 3: Present the feedback as if you're speaking to them in person.

  // Important Rules:
  // - Do not show the analysis and the suggestions. Only the feedback.
  // - The feedback should be presented in paragraph form, with a maximum of 100 words.`;

  const prompt = `Use the settings and complete the designated task in a numerical order:

  1. Task 1: Analyze all user answers ond questions bases on the following settings:
  Questions and Answers: ${formattedQnA}
    1.1: Rate overall answers ( 1 - 10) based on: Depth of Knowledge, Skill, and Context
    1.2: If rate is less than 5 suggest friendly major improvements
    1.3: If rate is more than 5 suggest friendly minor improvements
  
  2. Task 2: Generate a friendly feedback based on Task 1.
  3. Task 3: Present the feedback as if you're speaking to them in person.
  
  Settings:
  [Tone: friendly and supportive]
  [Purpose: help/teach/advise]
  [Technical Level: beginner/advanced]
  [Response Length: brief/detailed max 100 words]
  
  Rules:
  Conversational Delivery should be in paragraph form
  Presented as if youre talking to the applicant. (Maximum word limit 100)
  Do not show the analysis, rate, and suggestions.
  Remove all labeling.
  No unnecessary element.`;

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
      "Generating overall feedback failed",
      error.response?.data || error.message || error
    );
    throw new Error("An error occurred while generating overall feedback");
  }
};

module.exports = {
  resumeFeedBack,
  interviewAnswersFeeback,
  generateFirstQuestion,
  generateFollowUpQuestion,
  generateFirstTwoQuestions,
  generateQuestions,
  generateOverAllFeedback,
};
