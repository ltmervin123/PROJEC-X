const { URL, API_KEY } = require("../constant/aiServiceConstant");
const axios = require("axios");
const { getPrompt } = require("../utils/getPromptUtils");

const setData = (prompt) => {
  return {
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
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

const generateQuestions = async (
  resumeText,
  category,
  jobDescription,
  prevQuestions
) => {
  const prompt = getPrompt(resumeText, category, jobDescription, prevQuestions);

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

const generateOverAllFeedback = async (formattedData) => {
  const prompt = `
    1. Using a conversational and supportive tone, assess each answer on this formatted Question and Answer: ${formattedData} and generate an overall feedback based on the following criteria:

    Criteria:
    Grammar level
    Demonstrated skill level
    Experience shown
    Relevance to question
    Filler words used (counted)

    2. Analyze Sentence Structure of the answers and refine or improve in a short and concise form.
      2.1 Most Filler Words (Non-Contextual Filler Words that is read as one) that should be counted.

    3. Calculate overall score using:
        Average Calculation Method:
          1. Score each criterion 0-10
          2. Filler Word Penalty: Inverse scoring (fewer fillers = higher score(max 10))

          Calculate filler score based on filler word count
          - Fewer filler words = Higher score
          - More filler words = Lower score

          Scoring Logic(Total):
          - 0-1 filler words: 10 points (Perfect)
          - 2-5 filler words: 8 points
          - 6-9 filler words: 6 points
          - 10-15 filler words: 4 points
          - 16-20 filler words: 2 points
          -20+ filler words: 1 point

          Calculation Formula:
          - Base Calculation: (Grammar + Skill + Experience + Relevance + Filler Score) / 5
          - Rounding: Always round down to nearest whole number
          - Maximum Possible Score: 10

          Double-check scores for accuracy.

    4. Double-check both accuracy in Filler List counting.

    *strict JSON format* only, ensuring valid JSON syntax with no extra line breaks or mis formatted characters. Here’s the required format:

    {
      "criteriaScores": [
      {
      "criterion": "Grammar level",
      "score": "score" (whole numbers only).
      },
      {
      "criterion": "Demonstrated skill level",
      "score": "score" (whole numbers only).
      },
      {
      "criterion": "Experience shown",
      "score": "score" (whole numbers only).
      },
      {
      "criterion": "Relevance to question",
      "score": "score" (whole numbers only).
      },
      {
      "criterion": "Filler words",
      "score": "count" (whole numbers only).
      },
      {
      "criterion": "Overall Score",
      "score": "score" (averaged based on all criterion scores).
      },
      {
      "FillerList": "Count" (this count is for the filler word count from the Criterion),
      "list": "list" (List of all counted only single word filler words that is counted from the criterion, include duplicates)
      }
      ],

      "questionsFeedback": [
      "Feedback for question 1",
      "Feedback for question 2",
      "Feedback for question 3",
      "Feedback for question 4",
      "Feedback for question 5",
      ],

      "improvedAnswer": [
      "improvedAnswer 1",
      "improvedAnswer 2",
      "improvedAnswer 3",
      "improvedAnswer 4",
      "improvedAnswer 5",
      ]
    }

    Ensure that:
    - Ratings should never exceed 10
    - Ensure response is in valid JSON syntax format
    - Use a conversational and constructive tone
    - Highlight strengths while offering constructive feedback
    - Keep feedback dynamic and unique
    - Count all single word instances of filler words, make sure that filler count and filler list are the same count.
    - Settings: [Temperature: 0.4, Role: Assistant]`;

  const data = setData(prompt);

  try {
    const response = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
    });

    if (!response.data) {
      throw new error("No response data");
    }
    return response.data;
  } catch (error) {
    console.error(
      "Generating overall feedback failed",
      error.response?.data || error.message || error
    );
    throw new Error("Claude API error " + error.message);
  }
};

module.exports = {
  resumeFeedBack,
  interviewAnswersFeeback,
  generateFirstQuestion,
  generateFirstTwoQuestions,
  generateQuestions,
  generateOverAllFeedback,
};
