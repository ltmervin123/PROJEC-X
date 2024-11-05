const { URL, API_KEY } = require("../constant/aiServiceConstant");
const axios = require("axios");
const {
  formatQuestionAndAnswer,
} = require("../utils/formatterQuestionAndAnswerUtils");

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
  // const prompt = `Rate this resume: ${resumeText} for ${field}. Score 1-10 for each category. Give brief feedback on strengths and improvements.`;

  const prompt = `
  Task:
  Based on this resume: ${resumeText} for ${field} field, complete the following tasks:
  Analyze resume and rate (1.0-10.0)
  Generate overall Score, market strength, areas for improvement based on the analyzed resume

  Rules:
  Both Market Strength and Areas for improvement should be in paragraph form and presented as if you're talking in person.
  Only show the overall Score, resume strength, areas for improvement
  Remove any bullets
  Be brief and concise`;

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
  const prompt = `Generate 2 questions base on this resume: ${resumeText}
  1 a priming question based on a randomly selected criterion from the following: Course, Skill, Experience, Achievements, Education, and Projects.
  2 a dynamic, synthesized probing question (based on the criterion) that validates the applicant's depth of skill.
  
  Rules:
  All questions are asked in friendly- personal form
  Present the questions as if youre talking in person
  Remove all labeling.
  Show only the questions Nothing more`;

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

const generateQuestions = async (resumeText, difficulty, jobDescription) => {
  // const prompt = `
  // Resume: ${resumeText}
  // Job Description: ${jobDescription}

  // Objective:
  // Develop three unique, ${difficulty}-level interview questions based on the candidate's $resume and $jobdesc. These questions should assess the candidate's suitability for the position and create a conversational flow.

  // Question Types (Link resume and job qualifications):
  // 1. Priming
  // 2. Probing
  // 3. Practical

  // Criteria to Consider:
  // Job-specific requirements
  // Relevance
  // Skills and qualifications
  // Cultural fit and soft skills
  // Experience and achievements

  // Guidelines:
  // Use appropriate honorifics.
  // Ensure a smooth narrative flow with natural and engaging language.
  // Present only distinct and varied questions without additional elements or jargon.
  // [Settings:
  //   Temperature: 0.3,
  //   Role: Assistant,
  //   Tone: Friendly-Warm,
  //   Style: Realistic-Personal]`;

  const prompt = `
  Objective: 
  Develop three unique and dynamic, ${difficulty}-level interview questions based on the candidate's ${resumeText} and ${jobDescription}. These questions should assess the candidate's suitability for the position and create a conversational flow.

  Question Types (Link resume and job qualifications):
  1. Priming
  2. Probing
  3. Practical
  
  Criteria to Consider:
  Job-specific requirements
  Relevance
  Skills and qualifications
  Cultural fit and soft skills
  Experience and achievements
  
  Guidelines:
  Always  use appropriate honorifics.
  Ensure a smooth narrative flow with natural and engaging language.
  Present only the question.
  Avoid labels and unnecessary elements or jargon.
  Concise Questions.

  Settings:
  [Temperature: 0.3, Role: Assistant, Tone: Friendly-Warm, Style: Realistic-Personal]`;

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
//   const formattedQnA = formatQuestionAndAnswer(answerAndQuestion);
//   console.log("formattedQnA", formattedQnA);

//   const prompt = `
//   Use the answers in ${formattedQnA} for the task.

//   Task:
//   1. Analyze the answers and rate (1.0-10.0)
//   2 .Generate overall Score, Feedback, comments based on the analyzed answer

//   Rules:
//   Only show the overall score, feedback, comments
//   `;

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
//       "Generating overall feedback failed",
//       error.response?.data || error.message || error
//     );
//     throw new Error("An error occurred while generating overall feedback");
//   }
// };

const generateOverAllFeedback = async (answerAndQuestion) => {
  const formattedQnA = formatQuestionAndAnswer(answerAndQuestion);
  console.log("formattedQnA", formattedQnA);

  const prompt = `Write feedback in a friendly, conversational style (max 100 words) on this Question and Answer : ${formattedQnA}. 
  Evaluate the response on knowledge, skill, and context using a 1-10 scale.
  For scores 5 or below:
  Identify fundamental improvements needed
  Provide clear guidance for major changes
  For scores above 5:
  Suggest refinements
  Offer specific tips for enhancement
  Format:
  Natural conversation tone
  Direct address to person
  No headers or labels
  Single flowing paragraph
  End naturally without follow-up offers
  Keep technical terms simple
  Hide scoring in the feedback
  Focus on being helpful while maintaining a supportive, personal tone.`;

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
